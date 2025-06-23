import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat, StudyChatMessage } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
	badRequestError,
} from "../../utils";

const updateStudyChatById = async (req: CustomRequest, res: Response) => {
	try {
		const { id } = req.params;
		const studyChat = await StudyChat.findOne({ _id: id }).populate(
			"members"
		);
		if (!studyChat) throw notFoundError("Study chat not found");

		const { members, photoUrl } = req.body;

		if (photoUrl?.trim() || members.length > 0) {
			studyChat.photoUrl = photoUrl?.trim()
				? photoUrl
				: studyChat.photoUrl;

			if (studyChat.members.length + members.length > 20) {
				badRequestError(
					"A study chat cannot have more than 20 members"
				);
			}

			members.forEach((member: any) => {
				if (!studyChat.members.includes(member)) {
					studyChat.members.push(member);
				}
			});

			await studyChat.save();
		}

		res.status(StatusCodes.OK).json("Study chat updated successfully");
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default updateStudyChatById;
