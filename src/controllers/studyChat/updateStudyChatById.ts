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

		if (photoUrl?.trim() || Object.keys(members).length > 0) {
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

				addMembers.forEach((memberId: any) => {
					if (
						!studyChat.members.some(
							(member) => member._id.toString() == memberId
						)
					) {
						studyChat.members.push(memberId);
					}
				});
			}

			if (removeMembers?.length > 0) {
				// Check if owner is trying to remove themselves
				if (removeMembers.includes(studyChat.owner._id.toString())) {
					throw badRequestError(
						"Study chat owner cannot leave their own study chat"
					);
				}
				// Verify that a user (not the owner) is trying to remove only themselves from the studychat
				if (
					removeMembers.length === 1 &&
					removeMembers[0] == req.user._id
				) {
					throw unAuthorizedError(
						"User does not have the permission to remove this member from this study chat"
					);
				}
				// Remove the specified members
				removeMembers.forEach((memberId: any) => {
					if (
						studyChat.members.some(
							(member) => member._id.toString() == memberId
						)
					) {
						const index = studyChat.members.findIndex(
							(member) => member._id.toString() == memberId
						);
						if (index !== -1) {
							studyChat.members.splice(index, 1);
						}
					}
				});
			}

			await studyChat.save();
		}

		res.status(StatusCodes.OK).json(
			successRes("Study chat updated successfully", studyChat)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default updateStudyChatById;
