import { GEMINI_API_KEY, GEMINI_BASE_URL, GEMINI_THINKING_BUDGET } from "../../utils/config";

export interface LlmContentBlock {
	type: "text";
	text: string;
}

export interface LlmUsage {
	input_tokens: number;
	output_tokens: number;
}

export type LlmStopReason = "max_tokens" | "refusal" | "end_turn";

export interface LlmMessage {
	content: LlmContentBlock[];
	usage: LlmUsage;
	stop_reason: LlmStopReason;
}

interface GeminiCandidate {
	content?: { parts?: Array<{ text?: string }> };
	finishReason?: string;
}

interface GeminiUsageMetadata {
	promptTokenCount?: number;
	candidatesTokenCount?: number;
	thoughtsTokenCount?: number;
}

interface GeminiGenerateContentResponse {
	candidates?: GeminiCandidate[];
	usageMetadata?: GeminiUsageMetadata;
	promptFeedback?: { blockReason?: string };
}

interface GeminiCountTokensResponse {
	totalTokens?: number;
}

const toGeminiSchema = (node: unknown): unknown => {
	if (Array.isArray(node)) return node.map(toGeminiSchema);
	if (!node || typeof node !== "object") return node;

	const out: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
		if (
			key === "additionalProperties" ||
			key === "maxLength" ||
			key === "minLength"
		)
			continue;

		if (key === "type" && typeof value === "string") {
			out.type = value.toUpperCase();
			continue;
		}

		out[key] = toGeminiSchema(value);
	}

	return out;
};

const stopReasonOf = (reason: string | undefined): LlmStopReason => {
	switch (reason) {
		case "MAX_TOKENS":
			return "max_tokens";
		case "SAFETY":
		case "BLOCKLIST":
		case "PROHIBITED_CONTENT":
		case "SPII":
		case "IMAGE_SAFETY":
			return "refusal";
		default:
			return "end_turn";
	}
};

const post = async <T>(
	model: string,
	method: string,
	body: Record<string, unknown>
): Promise<T> => {
	const url = `${GEMINI_BASE_URL}/models/${encodeURIComponent(model)}:${method}`;

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"x-goog-api-key": GEMINI_API_KEY,
		},
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(10 * 60 * 1000),
	});

	const raw = await res.text();

	if (!res.ok) {
		let detail = raw.slice(0, 300);
		try {
			const parsed = JSON.parse(raw);
			detail = parsed?.error?.message || detail;
		} catch {}
		throw Object.assign(new Error(`Gemini ${method} failed: ${detail}`), {
			status: res.status === 429 ? 429 : res.status >= 500 ? 502 : res.status,
		});
	}

	try {
		return JSON.parse(raw) as T;
	} catch {
		throw new Error(
			`Gemini ${method}: provider returned a non-JSON body — ${raw.slice(0, 200)}`
		);
	}
};

export interface CreateMessageInput {
	system: string;
	user: string;
	maxTokens: number;
	model: string;
	useSchema: boolean;
	schema?: Record<string, unknown>;
}

export const createMessage = async ({
	system,
	user,
	maxTokens,
	model,
	useSchema,
	schema,
}: CreateMessageInput): Promise<LlmMessage> => {
	const generationConfig: Record<string, unknown> = { maxOutputTokens: maxTokens };

	if (useSchema && schema) {
		generationConfig.responseMimeType = "application/json";
		generationConfig.responseSchema = toGeminiSchema(schema);
	}

	if (GEMINI_THINKING_BUDGET !== undefined)
		generationConfig.thinkingConfig = {
			thinkingBudget: Number(GEMINI_THINKING_BUDGET),
		};

	const body = await post<GeminiGenerateContentResponse>(model, "generateContent", {
		systemInstruction: { parts: [{ text: system }] },
		contents: [{ role: "user", parts: [{ text: user }] }],
		generationConfig,
	});

	if (body?.promptFeedback?.blockReason)
		return {
			content: [],
			usage: { input_tokens: 0, output_tokens: 0 },
			stop_reason: "refusal",
		};

	const candidate = body?.candidates?.[0];
	const text = (candidate?.content?.parts ?? [])
		.map((part) => part?.text ?? "")
		.join("");

	const usage = body?.usageMetadata ?? {};

	return {
		content: text ? [{ type: "text", text }] : [],
		usage: {
			input_tokens: usage.promptTokenCount ?? 0,
			output_tokens:
				(usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
		},
		stop_reason: stopReasonOf(candidate?.finishReason),
	};
};

export const countTokens = async (model: string, text: string): Promise<number> => {
	try {
		const body = await post<GeminiCountTokensResponse>(model, "countTokens", {
			contents: [{ role: "user", parts: [{ text }] }],
		});
		if (typeof body?.totalTokens === "number") return body.totalTokens;
	} catch {}
	return Math.ceil(text.length / 4);
};
