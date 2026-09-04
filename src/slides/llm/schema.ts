import { z } from "zod";

import { SLIDE_LAYOUTS, Slide } from "../types";

export const LAYOUTS = SLIDE_LAYOUTS;

export const LIMITS = {
	title: 60,
	subtitle: 90,
	bodyItem: 90,
	emphasis: 12,
	bodyMin: 2,
	bodyMax: 5,
	visualQuery: 60,
};

const visualSchema = z.object({
	type: z.enum(["stock", "icon", "none"]),
	query: z.string().max(LIMITS.visualQuery).optional(),
	alt: z.string().max(120).optional(),
});

export const slideSchema = z.object({
	layout: z.enum(LAYOUTS),
	title: z.string().min(1).max(LIMITS.title),
	subtitle: z.string().max(LIMITS.subtitle).optional(),
	body: z
		.array(z.string().min(1).max(LIMITS.bodyItem))
		.max(LIMITS.bodyMax)
		.optional(),
	emphasis: z.string().max(LIMITS.emphasis).optional(),
	visual: visualSchema.optional(),
	speakerNotes: z.string().max(700).optional(),
});

export const responseSchema = z.object({
	slides: z.array(slideSchema).min(1),
});

export type RawSlide = z.infer<typeof slideSchema>;

export const jsonSchema = {
	type: "object",
	properties: {
		slides: {
			type: "array",
			minItems: 1,
			items: {
				type: "object",
				properties: {
					layout: { type: "string", enum: LAYOUTS },
					title: { type: "string", maxLength: LIMITS.title },
					subtitle: { type: "string", maxLength: LIMITS.subtitle },
					body: {
						type: "array",
						maxItems: LIMITS.bodyMax,
						items: { type: "string", maxLength: LIMITS.bodyItem },
					},
					emphasis: { type: "string", maxLength: LIMITS.emphasis },
					visual: {
						type: "object",
						properties: {
							type: { type: "string", enum: ["stock", "icon", "none"] },
							query: { type: "string", maxLength: LIMITS.visualQuery },
							alt: { type: "string" },
						},
						required: ["type"],
						additionalProperties: false,
					},
					speakerNotes: { type: "string" },
				},
				required: ["layout", "title"],
				additionalProperties: false,
			},
		},
	},
	required: ["slides"],
	additionalProperties: false,
};

const truncate = (value: string, max: number): string =>
	value.length <= max ? value : value.slice(0, max - 1).trimEnd() + "…";

export const enforceCount = <T>(
	slides: T[],
	wanted: number,
	warnings: string[]
): T[] => {
	if (slides.length < wanted) {
		warnings.push(
			`You asked for ${wanted} slides and the model wrote ${slides.length}.`
		);
		return slides;
	}

	if (slides.length === wanted) return slides;

	warnings.push(
		`The model wrote ${slides.length} slides; trimmed to the ${wanted} you asked for.`
	);

	return wanted === 1
		? slides.slice(0, 1)
		: [...slides.slice(0, wanted - 1), slides[slides.length - 1]];
};

export const clampSlide = (
	raw: RawSlide,
	index: number,
	warnings: string[]
): Slide => {
	const label = `slide ${index + 1}`;

	if (raw.title.length > LIMITS.title)
		warnings.push(`${label}: title truncated`);

	const body = raw.body
		?.map((item) => {
			if (item.length > LIMITS.bodyItem)
				warnings.push(`${label}: a bullet was truncated`);
			return truncate(item, LIMITS.bodyItem);
		})
		.slice(0, LIMITS.bodyMax);

	return {
		id: `s${index + 1}`,
		layout: raw.layout,
		title: truncate(raw.title, LIMITS.title),
		subtitle: raw.subtitle ? truncate(raw.subtitle, LIMITS.subtitle) : undefined,
		body: body && body.length ? body : undefined,
		emphasis: raw.emphasis ? truncate(raw.emphasis, LIMITS.emphasis) : undefined,
		visual: raw.visual,
		speakerNotes: raw.speakerNotes,
	};
};
