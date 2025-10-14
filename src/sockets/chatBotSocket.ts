import { ChatBotMessage } from "../models";
import { CustomSocket, errorRes, successRes } from "../utils";
import { sendChatBotMessage } from "../services";

const URI_PREFIX = "chatbot";

const socketControllers = (socket: CustomSocket) => {
	console.log("Socket connected!", socket.id);

	socket.on(`${URI_PREFIX}:send-message`, async (data) => {
		try {
			const { user } = socket;

			const { message } = data;
			if (!message?.trim()) {
				return socket.emit(
					`${URI_PREFIX}:send-message`,
					errorRes("`message` field is required")
				);
			}

			const previousChatBotMessages = await ChatBotMessage.find({
				sender: user._id,
			});

			const previousChatObject = previousChatBotMessages.map(
				(message) => {
					return {
						sender: message.sender._id.toString(),
						role: message.role,
						text: message.text,
					};
				}
			);

			const newChatObject = {
				sender: user._id.toString(),
				role: "user",
				text: message,
			};

			await new ChatBotMessage(newChatObject).save();

			previousChatObject.push({ ...newChatObject, role: "user" });

			const chatBotRequestBody = JSON.stringify(previousChatObject);

			const chatBotResponse = await sendChatBotMessage(
				chatBotRequestBody
			);

			socket.emit(
				`${URI_PREFIX}:send-message`,
				successRes("Message sent successfully", chatBotResponse)
			);
		} catch (err: any) {
			socket.emit("server-error", err.message);
		}
	});

	socket.on(`${URI_PREFIX}:delete-message`, async (data) => {
		try {
			const { messageId } = data;
			const message = await ChatBotMessage.findOne({ _id: messageId });
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
