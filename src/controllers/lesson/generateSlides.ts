import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { SLIDES_DEFAULT_COUNT, SLIDES_MAX_PAGES } from "../../utils/config";
import {
	badRequestError,
	CustomRequest,
	errorRes,
	successRes,
	unprocessableEntityError,
	unsupportedMediaTypeError,
} from "../../utils";
import { ACCEPTED_EXTENSIONS, detectKind, extractDocument } from "../../slides/extract";
import { generateSlides as runGenerateSlides } from "../../slides/llm/generateSlides";
import { GenerateSlidesResult } from "../../slides/types";

const MIN_USABLE_CHARS = 200;

const readSlideCount = (raw: unknown): number => {
	const n = Number(raw);
	if (!Number.isFinite(n)) return SLIDES_DEFAULT_COUNT;
	return Math.min(30, Math.max(3, Math.round(n)));
};

const readString = (raw: unknown, max = 80): string | undefined =>
	typeof raw === "string" && raw.trim() ? raw.trim().slice(0, max) : undefined;

const generateSlides = async (req: CustomRequest, res: Response) => {
	try {
		const file = req.file;
		if (!file)
			throw badRequestError('Attach a document in the "document" field.');

		const kind = detectKind(file.originalname, file.mimetype);
		if (!kind)
			throw unsupportedMediaTypeError(
				`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`
			);

		const extracted = await extractDocument(kind, file.buffer, SLIDES_MAX_PAGES);

		if (extracted.scanned)
			throw unprocessableEntityError(
				"This PDF has no text layer — it looks like a scan. Please upload a text-based PDF, or a .docx or .pptx version."
			);

		if (extracted.text.trim().length < MIN_USABLE_CHARS)
			throw unprocessableEntityError(
				"Could not read enough text from that document to build slides."
			);

		const result = await runGenerateSlides({
			extracted,
			slideCount: readSlideCount(req.body?.slideCount),
			subject: readString(req.body?.subject),
			gradeLevel: readString(req.body?.gradeLevel),
		});

		const data: GenerateSlidesResult = {
			slides: result.slides,
			warnings: [...extracted.warnings, ...result.warnings],
			meta: {
				filename: file.originalname,
				kind,
				pages: extracted.pages,
				pagesUsed: extracted.pagesUsed,
				charsExtracted: extracted.text.length,
				condensed: result.condensed,
				model: result.model,
				inputTokens: result.inputTokens,
				outputTokens: result.outputTokens,
			},
		};

		res.status(StatusCodes.OK).json(
			successRes(`Generated ${data.slides.length} slides`, data)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default generateSlides;
