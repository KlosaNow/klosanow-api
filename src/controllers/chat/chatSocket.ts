import { Server } from "socket.io";
import server from "../../server";
import { Chat, Message, User } from "../../models";

const io = new Server(server);
io.on("connection", (socket) => {
    // Listen for a "getChatById" event
    socket.on("getChatById", async (id) => {
        try {
            const chat = await Chat.findOne({ _id: id });
            if (!chat) {
                socket.emit("getChatByIdError", "Chat not found");
            } else {
                const allChatMessages = await Message.find({
                    chatId: chat._id,
                });

                socket.emit("getChatByIdSuccess", allChatMessages);
            }
        } catch (err) {
            socket.emit("getChatByIdError", err);
        }
    });

    socket.on("getAllChats", async (user) => {
        try {
            const chats = await Chat.find({ members: { $in: [user._id] } })
                .sort({ updatedAt: -1 })
                .exec();
            if (!chats) {
                socket.emit("getAllChatsError", "Chats not found");
            } else {
                socket.emit("getAllChatsSuccess", chats);
            }
        } catch (err) {
            socket.emit("getAllChatsError", err);
        }
    });
    socket.on("deleteChatById", async (id) => {
        try {
            const chat = await Chat.findOne({ _id: id });

            if (!chat) {
                socket.emit("deleteChatByIdError", "Chat not found");
            } else {
                await Message.deleteMany({ chatId: chat._id });
                await chat.deleteOne({ chat });
                socket.emit("deleteChatByIdSuccess");
            }
        } catch (err) {
            socket.emit("deleteChatByIdError", err);
        }
    });
    socket.on("deleteChatById", async (id) => {
        try {
            const chat = await Chat.findOne({ _id: id });

            if (!chat) {
                socket.emit("deleteChatByIdError", "Chat not found");
            } else {
                await Message.deleteMany({ chatId: chat._id });
                await chat.deleteOne({ chat });
                socket.emit("deleteChatByIdSuccess");
            }
        } catch (err) {
            socket.emit("deleteChatByIdError", err);
        }
    });

    socket.on("sendMessage", async (user, recipient, text) => {
        try {
            const recipientUserExist = await User.findOne({ _id: recipient });

            if (!recipientUserExist) {
                socket.emit("sendMessageError", "Invalid chat recipient");
            } else {
                var chatExists = await Chat.findOne({
                    members: [user._id, recipient],
                });
                if (!chatExists) {
                    chatExists = new Chat({ members: [user._id, recipient] });
                    await chatExists.save();
                }

                const newMessage = new Message({
                    chatId: chatExists!._id,
                    text,
                    recipient,
                });
                await newMessage.save();

                const allChatMessages = await Message.find({
                    chatId: chatExists!._id,
                });

                socket.emit("sendMessageSuccess", allChatMessages);
            }
        } catch (err) {
            socket.emit("sendMessageError", err);
        }
    });
});
