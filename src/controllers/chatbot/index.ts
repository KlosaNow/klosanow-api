import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Ollama } from "ollama";

import { OLLAMA_HOST, OLLAMA_MODEL } from "../../utils/config";
import { successRes, errorRes } from "../../utils";

const chatWithAIModel = async (req: Request, res: Response) => {
	try {
		const { message } = req.body;
		if (!message?.trim()) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json(errorRes("No message was sent to the chatbot"));
		}

		const systemPrompt = {
			role: "system",
			content: `You are a helpful assistant. Please answer the questions to the best of your ability.`,
		};
		const userPrompt = { role: "user", content: message };
		const messages = [systemPrompt, userPrompt];

		const ollama = new Ollama({ host: OLLAMA_HOST });
		const response = await ollama.chat({
			model: OLLAMA_MODEL,
			stream: false,
			messages,
		});
		res.status(StatusCodes.OK).json(successRes(response.message.content));
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default chatWithAIModel;
