export type DocumentKind = "pdf" | "docx" | "pptx";

export interface ExtractResult {
	kind: DocumentKind;
	text: string;
	pages: number;
	pagesUsed: number;
	sections: string[];
	warnings: string[];
	scanned: boolean;
}
