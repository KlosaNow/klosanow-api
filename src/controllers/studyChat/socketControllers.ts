import { Types } from "mongoose";
import { StudyChat, StudyChatMessage, User } from "../../models";
import { CustomSocket, errorRes, successRes } from "../../utils";

const URI_PREFIX = "studychats";

const socketControllers = (socket: CustomSocket) => {
	socket.on(`${URI_PREFIX}:get-all`, async () => {
		try {
			const { user } = socket;
			const studyChats = await StudyChat.find({
				members: { $in: [user._id] },
			})
				.sort({ updatedAt: -1 })
				.populate("members")
				.exec();

			socket.emit(
				`${URI_PREFIX}:get-all`,
				successRes("Study chats returned successfully", studyChats)
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:get-one`, async (data) => {
		try {
			const { studyChatId } = data;
			const studyChat = await StudyChat.findOne({ _id: studyChatId });
			if (!studyChat) {
				return socket.emit(
					`${URI_PREFIX}:get-one`,
					errorRes("Study chat not found")
				);
			} else {
				const allStudyChatMessages = await StudyChatMessage.find({
					studyChatId: studyChat._id,
				});

				socket.emit(
					`${URI_PREFIX}:get-one`,
					successRes(
						"Study chat returned successfully",
						allStudyChatMessages
					)
				);
			}
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:create`, async (data) => {
		try {
			let { user } = socket;
			user = await User.findOne({ _id: user._id });

			if (user.studyChats.owns.length > 1) {
				return socket.emit(
					`${URI_PREFIX}:create`,
					errorRes("A user can create only one study chat")
				);
			}

			const { title, photoUrl, members } = data;
			if (!title?.trim()) {
				return socket.emit(
					`${URI_PREFIX}:create`,
					errorRes("`title` field is required")
				);
			}
			// Add user to the members list
			members.push(user._id);
			if (members.length > 20) {
				return socket.emit(
					`${URI_PREFIX}:create`,
					errorRes("A study chat cannot have more than 20 members")
				);
			}

			const newStudyChat = new StudyChat({
				owner: user._id,
				title,
				photoUrl,
				members,
			});
			await (await newStudyChat.populate("members")).save();

			// Update the number of study chats a user owns
			user.studyChats.owns.push(newStudyChat._id);
			await user.save();

			return socket.emit(
				`${URI_PREFIX}:create`,
				successRes("Study chat created successfully", newStudyChat)
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:delete-one`, async (data) => {
		try {
			const { studyChatId } = data;
			const studyChat = await StudyChat.findOne({ _id: studyChatId });
			if (!studyChat) {
				return socket.emit(
					`${URI_PREFIX}:delete-one`,
					errorRes("Study chat not found")
				);
			}

			await StudyChatMessage.deleteMany({ studyChatId: studyChat._id });
			await studyChat.deleteOne();

			let { user } = socket;
			user = await User.findOne({ _id: user._id });
			user.studyChats.owns = user.studyChats.owns.filter(
				(stdcht: Types.ObjectId) => stdcht != studyChat._id
			);
			await user.save();

			if (user.studyChats.owns.length > 1) {
				return socket.emit(
					`${URI_PREFIX}:create`,
					errorRes("A user can create only one study chat")
				);
			}

			socket.emit(
				`${URI_PREFIX}:delete-one`,
				successRes("Study chat deleted successfully")
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:add-members`, async (data) => {
		try {
			const { studyChatId, members } = data;
			if (!members) {
				return socket.emit(
					`${URI_PREFIX}:add-members`,
					errorRes("`members` field is required")
				);
			}

			const studyChat = await StudyChat.findOne({
				_id: studyChatId,
			}).populate("members");
			if (!studyChat) {
				return socket.emit(
					`${URI_PREFIX}:add-members`,
					errorRes("Study chat not found")
				);
			}

			if (studyChat.members.length + members.length > 20) {
				return socket.emit(
					`${URI_PREFIX}:add-members`,
					errorRes("A study chat cannot have more than 20 members")
				);
			}

			members.forEach((member: any) => {
				if (!studyChat.members.includes(member)) {
					studyChat.members.push(member);
				}
			});
			await studyChat.save();

			return socket.emit(
				`${URI_PREFIX}:add-members`,
				successRes("Members added successfully", studyChat)
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:update-photo`, async (data) => {
		try {
			const { studyChatId, photoUrl } = data;
			if (!photoUrl?.trim()) {
				return socket.emit(
					`${URI_PREFIX}:update-photo`,
					errorRes("`photoUrl` field is required")
				);
			}

			const studyChat = await StudyChat.findOne({ _id: studyChatId });
			if (!studyChat) {
				return socket.emit(
					`${URI_PREFIX}:update-photo`,
					errorRes("Study chat not found")
				);
			}
			studyChat.photoUrl = photoUrl;
			await studyChat.save();

			return socket.emit(
				`${URI_PREFIX}:update-photo`,
				successRes("Study chat photo updated successfully")
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:send-message`, async (data) => {
		try {
			let { user } = socket;

			const { studyChatId, message } = data;
			if (!studyChatId?.trim() || !message?.trim()) {
				return socket.emit(
					`${URI_PREFIX}:send-message`,
					errorRes("`studyChatId` and `message` fields are required,")
				);
			}

			const studyChat = await StudyChat.findOne({
				_id: studyChatId,
				members: { $in: [user._id] },
			}).exec();
			if (!studyChat) {
				return socket.emit(
					`${URI_PREFIX}:send-message`,
					errorRes("Study chat not found")
				);
			}

			const newMessage = new StudyChatMessage({
				studyChatId: studyChat._id,
				sender: user._id,
				text: message,
			});
			await newMessage.save();

			const allStudyChatMessages = await StudyChatMessage.find({
				studyChatId: studyChat!._id,
			});

			socket.emit(
				`${URI_PREFIX}:send-message`,
				successRes("Message sent successfully", allStudyChatMessages)
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});
};

export default socketControllers;
