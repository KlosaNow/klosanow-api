import { StudyChat, StudyChatMessage } from "../../models";
import { CustomSocket, errorRes, successRes } from "../../utils";

const URI_PREFIX = "studychats";

const socketControllers = (socket: CustomSocket) => {
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
