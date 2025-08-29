import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat, User } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	badRequestError,
} from "../../utils";
import {
	STUDYCHAT_CREATION_LIMIT,
	STUDYCHAT_MEMBERS_LIMIT,
} from "../../utils/limits";

const createStudyChat = async (req: CustomRequest, res: Response) => {
	try {
		let user = req.user;

		const { title, photoUrl, members } = req.body;
		if (!title?.trim()) throw badRequestError("`title` field is required");

		user = await User.findOne({ _id: user._id });

		if (user.studyChats.owns.length >= 1) {
			throw badRequestError(
				`A user can create only ${STUDYCHAT_CREATION_LIMIT} study chat`
			);
		}

		members.push(user._id);
		if (members.length > 20) {
			throw badRequestError(
				`A study chat cannot have more than ${STUDYCHAT_MEMBERS_LIMIT} members`
			);
		}

		const newStudyChat = new StudyChat({
			owner: user._id,
			title,
			photoUrl,
			members,
		});
		await (await newStudyChat.populate("members")).save();

		user.studyChats.owns.push(newStudyChat._id);
		await user.save();

		res.status(StatusCodes.OK).json(
			successRes("Study chat created successfully", newStudyChat)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default createStudyChat;
