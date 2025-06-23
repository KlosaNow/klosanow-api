import { Chat, ChatMessage, User } from "../../models";
import { CustomSocket, errorRes, successRes } from "../../utils";

const URI_PREFIX = "chats";

const socketControllers = (socket: CustomSocket) => {
	console.log("Socket connected!", socket.id);

	socket.on(`${URI_PREFIX}:send-message`, async (data) => {
		try {
			const { user } = socket;

			const { recipientId, message } = data;
			if (!recipientId?.trim() || !message?.trim()) {
				return socket.emit(
					`${URI_PREFIX}:send-message`,
					errorRes("`recipientId` and `message` fields are required")
				);
			}

			const recipientUserExist = await User.findOne({ _id: recipientId });
			if (!recipientUserExist) {
				return socket.emit(
					`${URI_PREFIX}:send-message`,
					errorRes("Invalid chat recipient")
				);
			}
			let chatExists = await Chat.findOne({
				members: { $all: [user._id, recipientId] },
			});
			if (!chatExists) {
				chatExists = new Chat({ members: [user._id, recipientId] });
				await chatExists.save();
			}

			const newMessage = new ChatMessage({
				chatId: chatExists!._id,
				text: message,
				sender: user._id,
				recipient: recipientId,
			});
			await newMessage.save();

			const allChatMessages = await ChatMessage.find({
				chatId: chatExists!._id,
			}).populate("sender recipient");

			socket.emit(
				`${URI_PREFIX}:send-message`,
				successRes("Message sent successfully", allChatMessages)
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:delete-message`, async (data) => {
		try {
			const { messageId } = data;
			const message = await ChatMessage.findOne({ _id: messageId });
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
