import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

import { ExtractResult } from "./types";

const parser = new XMLParser({ ignoreAttributes: true, textNodeName: "#text" });

const collectText = (node: unknown, out: string[]): void => {
	if (node === null || node === undefined) return;

	if (Array.isArray(node)) {
		node.forEach((child) => collectText(child, out));
		return;
	}

	if (typeof node === "object") {
		for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
			if (key === "a:t") {
				if (Array.isArray(value)) value.forEach((v) => out.push(String(v)));
				else out.push(String(value));
			} else {
				collectText(value, out);
			}
		}
	}
};

const slideNumber = (path: string): number => {
	const match = path.match(/slide(\d+)\.xml$/);
	return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

export const extractPptx = async (
	buffer: Buffer,
	maxPages: number
): Promise<ExtractResult> => {
	const warnings: string[] = [];
	const zip = await JSZip.loadAsync(buffer);

	const slidePaths = Object.keys(zip.files)
		.filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
		.sort((a, b) => slideNumber(a) - slideNumber(b));

	const pages = slidePaths.length;
	if (pages === 0)
		return {
			kind: "pptx",
			text: "",
			pages: 0,
			pagesUsed: 0,
			sections: [],
			warnings: ["No slides found in the presentation."],
			scanned: false,
		};

	if (pages > maxPages)
		warnings.push(
			`Presentation has ${pages} slides; only the first ${maxPages} were used.`
		);

	const used = slidePaths.slice(0, maxPages);
	const sections: string[] = [];

	for (const path of used) {
		const xml = await zip.files[path].async("string");
		const runs: string[] = [];
		collectText(parser.parse(xml), runs);
		sections.push(
			runs
				.map((r) => r.trim())
				.filter(Boolean)
				.join("\n")
		);
	}

	return {
		kind: "pptx",
		text: sections
			.map((body, i) => `--- Source slide ${i + 1} ---\n${body}`)
			.join("\n\n"),
		pages,
		pagesUsed: used.length,
		sections,
		warnings,
		scanned: false,
	};
};
