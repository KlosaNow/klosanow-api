import mammoth from "mammoth";

import { ExtractResult } from "./types";

const CHARS_PER_PAGE = 1800;

export const extractDocx = async (
	buffer: Buffer,
	maxPages: number
): Promise<ExtractResult> => {
	const warnings: string[] = [];
	const { value } = await mammoth.extractRawText({ buffer });
	const text = value ?? "";

	const pages = Math.max(1, Math.ceil(text.length / CHARS_PER_PAGE));
	const capChars = maxPages * CHARS_PER_PAGE;

	if (text.length > capChars)
		warnings.push(
			`Document is roughly ${pages} pages; only about the first ${maxPages} were used.`
		);

	return {
		kind: "docx",
		text: text.slice(0, capChars),
		pages,
		pagesUsed: Math.min(pages, maxPages),
		sections: [],
		warnings,
		scanned: false,
	};
};
