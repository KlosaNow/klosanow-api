import pdfParse from "pdf-parse";

import { ExtractResult } from "./types";

const SCANNED_CHARS_PER_PAGE = 100;

export const extractPdf = async (
	buffer: Buffer,
	maxPages: number
): Promise<ExtractResult> => {
	const warnings: string[] = [];

	const result = await pdfParse(buffer, { max: maxPages });
	const pages = result.numpages || 1;
	const pagesUsed = Math.min(pages, maxPages);
	const text = result.text ?? "";

	if (pages > maxPages)
		warnings.push(
			`Document has ${pages} pages; only the first ${maxPages} were used.`
		);

	if (text.trim().length / pagesUsed < SCANNED_CHARS_PER_PAGE)
		return {
			kind: "pdf",
			text: "",
			pages,
			pagesUsed,
			sections: [],
			warnings,
			scanned: true,
		};

	return {
		kind: "pdf",
		text,
		pages,
		pagesUsed,
		sections: [],
		warnings,
		scanned: false,
	};
};
