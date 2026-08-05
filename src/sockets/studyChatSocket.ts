import { Server } from "socket.io";

import { StudyChat, StudyChatMessage } from "../models";
import { CustomSocket, errorRes, isUserOnline, successRes } from "../utils";
import { sendPushToUser } from "../services/pushService";

const URI_PREFIX = "studychats";

const socketControllers = (io: Server, socket: CustomSocket) => {
	console.log("Socket connected!", socket.id);
	socket.join(socket.user._id.toString());

	// STUDY CHAT MESSAGES
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

			const recipients = studyChat.members.filter(
				(memberId: any) => memberId.toString() !== user._id.toString()
			);

			await Promise.all(
				recipients.map(async (memberId: any) => {
					const recipientId = memberId.toString();
					io.to(recipientId).emit(
						`${URI_PREFIX}:new-message`,
						successRes("New message received", allStudyChatMessages)
					);

					if (!isUserOnline(io, recipientId)) {
						await sendPushToUser(recipientId, {
							title: String(studyChat.title),
							body: `${user.firstName}: ${message}`,
							data: { type: "studychat", studyChatId: studyChat._id },
						});
					}
				})
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:delete-message`, async (data) => {
		try {
			const { messageId } = data;
			const message = await StudyChatMessage.findOne({ _id: messageId });
			if (!message) {
				return socket.emit(
					`${URI_PREFIX}:delete-message`,
					errorRes("Message not found")
				);
			} else {
				await message.deleteOne();
				socket.emit(
					`${URI_PREFIX}:delete-one`,
					successRes("Message deleted successfully")
				);
			}
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});
};

export default socketControllers;
