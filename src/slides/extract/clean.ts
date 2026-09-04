const PAGE_NUMBER = /^(?:page\s*)?\d{1,4}(?:\s*(?:of|\/)\s*\d{1,4})?$/i;
const DOT_LEADER = /\.{4,}\s*\d{1,4}$/;
const END_MATTER =
	/^(references|bibliography|works cited|further reading|index|appendix)\b/i;

const MAX_REMOVAL_RATIO = 0.4;

export interface CleanResult {
	text: string;
	removedLines: number;
	guarded: boolean;
}

const detectRunningLines = (lines: string[]): Set<string> => {
	const counts = new Map<string, number>();
	lines.forEach((line) => {
		const key = line.trim();
		if (key.length > 3 && key.length < 80)
			counts.set(key, (counts.get(key) ?? 0) + 1);
	});

	const threshold = Math.max(3, Math.floor(lines.length / 200));
	return new Set(
		[...counts.entries()]
			.filter(([, n]) => n >= threshold)
			.map(([line]) => line)
	);
};

const applyFilters = (
	lines: string[],
	running: Set<string>
): { kept: string[]; removed: number } => {
	const kept: string[] = [];
	let removed = 0;
	let inEndMatter = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (!inEndMatter && trimmed.length < 40 && END_MATTER.test(trimmed))
			inEndMatter = true;

		if (
			inEndMatter ||
			PAGE_NUMBER.test(trimmed) ||
			DOT_LEADER.test(trimmed) ||
			running.has(trimmed)
		) {
			if (trimmed) removed++;
			continue;
		}

		kept.push(line);
	}

	return { kept, removed };
};

export const cleanExtractedText = (raw: string): CleanResult => {
	const lines = raw.replace(/\r\n?/g, "\n").split("\n");
	const nonEmpty = lines.filter((line) => line.trim()).length;

	let { kept, removed } = applyFilters(lines, detectRunningLines(lines));
	let guarded = false;

	if (nonEmpty > 0 && removed / nonEmpty > MAX_REMOVAL_RATIO) {
		({ kept, removed } = applyFilters(lines, new Set()));
		guarded = true;
	}

	const text = kept
		.join("\n")
		.replace(/[ \t]{2,}/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();

	return { text, removedLines: removed, guarded };
};
