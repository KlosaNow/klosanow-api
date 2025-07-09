import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { StudyChat } from "../../models";
import {
	errorRes,
	successRes,
	CustomRequest,
	notFoundError,
	badRequestError,
	unAuthorizedError,
} from "../../utils";
import { STUDYCHAT_MEMBERS_LIMIT } from "../../utils/limits";

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

			const { addMembers, removeMembers } = members;

			if (addMembers?.length > 0) {
				if (studyChat.members.length + addMembers.length > 20) {
					badRequestError(
						`A study chat cannot have more than ${STUDYCHAT_MEMBERS_LIMIT} members`
					);
				}

				members.forEach((member: any) => {
					if (!studyChat.members.includes(member)) {
						studyChat.members.push(member);
					}
				});
			}

			if (removeMembers?.length > 0) {
				// Check if it is the studychat owner that is trying to remove people
				if (studyChat.owner._id.toString() == req.user._id) {
					// Check if owner is trying to remove themselves
					if (studyChat.owner._id.toString() in removeMembers) {
						throw badRequestError(
							"Study chat owner cannot leave the study chat"
						);
					} else {
						removeMembers.forEach((member: any) => {
							if (studyChat.members.includes(member)) {
								studyChat.members.splice(member, 1);
							}
						});
					}
				}

				// Check if it a user that is trying to remove other users
				if (removeMembers[0] != [req.user._id][0]) {
					throw unAuthorizedError(
						"User does not have the permission to remove this a user from this study chat"
					);
				} else {
					if (studyChat.members.includes(req.user._id)) {
						studyChat.members.splice(req.user._id, 1);
					}
				}
			}

			await studyChat.save();

			res.status(StatusCodes.OK).json(
				successRes("Study chat updated successfully", studyChat)
			);
		}
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default updateStudyChatById;
