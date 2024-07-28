import { Chat, ChatMessage, User } from "../../models";
import { CustomSocket, errorRes, successRes } from "../../utils";

const URI_PREFIX = "chats";

const socketControllers = (socket: CustomSocket) => {
    console.log("Socket connected!", socket.id);

    socket.on(`${URI_PREFIX}:get-all`, async () => {
        try {
            const { user } = socket;
            const chats = await Chat.find({ members: { $in: [user._id] } })
                .sort({ updatedAt: -1 })
                .exec();

            socket.emit(
                `${URI_PREFIX}:get-all`,
                successRes("Chats returned successfully", chats)
            );
        } catch (err: any) {
            socket.emit("server-error", err.message);
        }
    });

    socket.on(`${URI_PREFIX}:get-one`, async (data) => {
        try {
            const { chatId } = data;
            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) {
                return socket.emit(
                    `${URI_PREFIX}:get-one`,
                    errorRes("Chat not found")
                );
            } else {
                const allChatMessages = await ChatMessage.find({
                    chatId: chat._id,
                });

                socket.emit(
                    `${URI_PREFIX}:get-one`,
                    successRes("Chat returned successfully", allChatMessages)
                );
            }
        } catch (err: any) {
            socket.emit("server-error", err.message);
        }
    });

    socket.on(`${URI_PREFIX}:delete-one`, async (data) => {
        try {
            const { chatId } = data;
            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) {
                return socket.emit(
                    `${URI_PREFIX}:delete-one`,
                    errorRes("Chat not found")
                );
            } else {
                await ChatMessage.deleteMany({ chatId: chat._id });
                await chat.deleteOne();

                socket.emit(
                    `${URI_PREFIX}:delete-one`,
                    successRes("Chat deleted successfully")
                );
            }
        } catch (err: any) {
            socket.emit("server-error", err.message);
        }
    });

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
                members: [user._id, recipientId],
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
            });

            socket.emit(
                `${URI_PREFIX}:send-message`,
                successRes("Message sent successfully", allChatMessages)
            );
        } catch (err: any) {
            socket.emit("server-error", err.message);
        }
    });
};

export default socketControllers;
