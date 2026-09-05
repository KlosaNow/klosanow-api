import { extractPdf } from "./pdf";
import { extractDocx } from "./docx";
import { extractPptx } from "./pptx";
import { cleanExtractedText } from "./clean";
import { DocumentKind, ExtractResult } from "./types";

export { DocumentKind, ExtractResult };

const BY_MIME: Record<string, DocumentKind> = {
	"application/pdf": "pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		"docx",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation":
		"pptx",
};

const BY_EXTENSION: Record<string, DocumentKind> = {
	pdf: "pdf",
	docx: "docx",
	pptx: "pptx",
};

export const ACCEPTED_MIME_TYPES = Object.keys(BY_MIME);
export const ACCEPTED_EXTENSIONS = Object.keys(BY_EXTENSION);

export const detectKind = (
	filename: string,
	mimetype?: string
): DocumentKind | null => {
	if (mimetype && BY_MIME[mimetype]) return BY_MIME[mimetype];
	const ext = filename.split(".").pop()?.toLowerCase() ?? "";
	return BY_EXTENSION[ext] ?? null;
};

export const extractDocument = async (
	kind: DocumentKind,
	buffer: Buffer,
	maxPages: number
): Promise<ExtractResult> => {
	const result =
		kind === "pdf"
			? await extractPdf(buffer, maxPages)
			: kind === "docx"
				? await extractDocx(buffer, maxPages)
				: await extractPptx(buffer, maxPages);

	if (!result.text) return result;

	const { text, removedLines, guarded } = cleanExtractedText(result.text);
	const warnings = [...result.warnings];
	if (removedLines > 20)
		warnings.push(
			`Removed ${removedLines} lines of headers, footers or end matter.`
		);
	if (guarded)
		warnings.push(
			"Header detection was skipped — it matched too much of the document."
		);

	return { ...result, text, warnings };
};
