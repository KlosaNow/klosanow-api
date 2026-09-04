import { DocumentKind } from "./extract/types";

export const SLIDE_LAYOUTS = [
	"title",
	"statement",
	"bullets",
	"twoColumn",
	"steps",
	"compare",
	"definition",
	"summary",
] as const;

export type SlideLayout = (typeof SLIDE_LAYOUTS)[number];

export interface SlideVisual {
	type: "stock" | "icon" | "none";
	query?: string;
	url?: string;
	alt?: string;
}

export interface Slide {
	id: string;
	layout: SlideLayout;
	title: string;
	subtitle?: string;
	body?: string[];
	emphasis?: string;
	visual?: SlideVisual;
	speakerNotes?: string;
}

export interface GenerateSlidesMeta {
	filename: string;
	kind: DocumentKind;
	pages: number;
	pagesUsed: number;
	charsExtracted: number;
	condensed: boolean;
	model: string;
	inputTokens: number;
	outputTokens: number;
}

export interface GenerateSlidesResult {
	slides: Slide[];
	warnings: string[];
	meta: GenerateSlidesMeta;
}
