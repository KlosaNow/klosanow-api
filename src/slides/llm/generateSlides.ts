import {
	GEMINI_MODEL,
	GEMINI_CONDENSE_MODEL,
	SLIDES_CONDENSE_THRESHOLD_TOKENS,
} from "../../utils/config";
import { unprocessableEntityError, badGatewayError } from "../../utils/CustomError";
import { ExtractResult } from "../extract/types";
import { Slide } from "../types";
import { countTokens, createMessage, LlmMessage } from "./gemini";
import { CONDENSE_SYSTEM_PROMPT, SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { clampSlide, enforceCount, jsonSchema, responseSchema } from "./schema";
import { LLM_STRUCTURED_OUTPUT } from "../../utils/config";

const textOf = (message: LlmMessage): string =>
	message.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("");

const usageOf = (message: LlmMessage): { input: number; output: number } => ({
	input: message.usage?.input_tokens ?? 0,
	output: message.usage?.output_tokens ?? 0,
});

const isolateJson = (raw: string): string => {
	const fenced = raw.trim().match(/^```(?:json)?\s*([\s\S]*?)```$/);
	const body = (fenced ? fenced[1] : raw).trim();
	const start = body.indexOf("{");
	const end = body.lastIndexOf("}");
	return start >= 0 && end > start ? body.slice(start, end + 1) : body;
};

const safeJson = (raw: string): unknown => {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
};

const call = (
	system: string,
	user: string,
	maxTokens: number,
	model: string,
	useSchema: boolean
) =>
	createMessage({
		system,
		user,
		maxTokens,
		model,
		useSchema,
		schema: useSchema ? jsonSchema : undefined,
	});

export interface GenerateInput {
	extracted: ExtractResult;
	slideCount: number;
	subject?: string;
	gradeLevel?: string;
}

export interface GenerateOutput {
	slides: Slide[];
	warnings: string[];
	condensed: boolean;
	model: string;
	inputTokens: number;
	outputTokens: number;
}

export const generateSlides = async ({
	extracted,
	slideCount,
	subject,
	gradeLevel,
}: GenerateInput): Promise<GenerateOutput> => {
	const warnings: string[] = [];
	const model = GEMINI_MODEL;
	let inputTokens = 0;
	let outputTokens = 0;

	let source = extracted.text;
	let condensed = false;

	const sourceTokens = await countTokens(model, source);
	if (sourceTokens > SLIDES_CONDENSE_THRESHOLD_TOKENS) {
		const res = await call(
			CONDENSE_SYSTEM_PROMPT,
			source,
			16000,
			GEMINI_CONDENSE_MODEL,
			false
		);
		const reduced = textOf(res).trim();
		const used = usageOf(res);
		inputTokens += used.input;
		outputTokens += used.output;

		if (reduced.length > 500) {
			source = reduced;
			condensed = true;
			warnings.push(
				`Source was long (~${sourceTokens} tokens) and was condensed before slide generation.`
			);
		}
	}

	const userPrompt = buildUserPrompt({
		text: source,
		slideCount,
		subject,
		gradeLevel,
		sections: extracted.sections,
	});

	const first = await call(
		SYSTEM_PROMPT,
		userPrompt,
		16000,
		model,
		LLM_STRUCTURED_OUTPUT
	);
	inputTokens += usageOf(first).input;
	outputTokens += usageOf(first).output;

	if (first.stop_reason === "refusal")
		throw unprocessableEntityError("The model declined to process this document.");

	let parsed = responseSchema.safeParse(safeJson(isolateJson(textOf(first))));

	if (!parsed.success) {
		const repair = await call(
			SYSTEM_PROMPT,
			`${userPrompt}\n\nYour previous reply was not valid against the required shape. Errors:\n${parsed.error.issues
				.slice(0, 12)
				.map((i) => `- ${i.path.join(".")}: ${i.message}`)
				.join("\n")}\n\nReturn only the corrected JSON object.`,
			16000,
			model,
			LLM_STRUCTURED_OUTPUT
		);
		inputTokens += usageOf(repair).input;
		outputTokens += usageOf(repair).output;
		parsed = responseSchema.safeParse(safeJson(isolateJson(textOf(repair))));
		if (parsed.success) warnings.push("Model output needed one repair pass.");
	}

	if (!parsed.success)
		throw badGatewayError("Could not get valid slide data from the model.");

	const bounded = enforceCount(parsed.data.slides, slideCount, warnings);
	const slides = bounded.map((raw, i) => clampSlide(raw, i, warnings));

	return { slides, warnings, condensed, model, inputTokens, outputTokens };
};
