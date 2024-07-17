import { Chat, ChatMessage, User } from "../../models";
import { CustomSocket, errorRes, successRes } from "../../utils";

const socketControllers = (socket: CustomSocket) => {
  console.log("Socket connected!", socket.id);

  // Listen for a "getAllChats" event
  socket.on("getAllChats", async () => {
    try {
      const { user } = socket;
      const chats = await Chat.find({ members: { $in: [user._id] } })
        .sort({ updatedAt: -1 })
        .exec();

      socket.emit(
        "getAllChats",
        successRes("Chats returned successfully", chats)
      );
    } catch (err: any) {
      socket.emit("serverError", err.message);
    }
  });

  // Listen for a "getChatById" event
  socket.on("getChatById", async (id) => {
    try {
      const chat = await Chat.findOne({ _id: id });
      if (!chat) {
        return socket.emit("getChatById", errorRes("Chat not found"));
      } else {
        const allChatMessages = await ChatMessage.find({
          chatId: chat._id,
        });

        socket.emit(
          "getChatById",
          successRes("Chat returned successfully", allChatMessages)
        );
      }
    } catch (err: any) {
      socket.emit("serverError", err.message);
    }
  });

  // Listen for a "deleteChatById" event
  socket.on("deleteChatById", async (id) => {
    try {
      const chat = await Chat.findOne({ _id: id });
      if (!chat) {
        return socket.emit("deleteChatById", errorRes("Chat not found"));
      } else {
        await ChatMessage.deleteMany({ chatId: chat._id });
        await chat.deleteOne({ chat });

        socket.emit("deleteChatById", successRes("Chat deleted successfully"));
      }
    } catch (err: any) {
      socket.emit("serverError", err.message);
    }
  });

  // Listen for a "sendMessage" event
  socket.on("sendMessage", async (data) => {
    try {
      const { user } = socket;

      const { recipient, message } = data;
      if (!recipient?.trim() || !message?.trim()) {
        return socket.emit(
          "sendMessage",
          errorRes("Message recipient and text are required,")
        );
      }

      const recipientUserExist = await User.findOne({ _id: recipient });
      if (!recipientUserExist) {
        return socket.emit("sendMessage", errorRes("Invalid chat recipient"));
      } else {
        var chatExists = await Chat.findOne({
          members: [user._id, recipient],
        });
        if (!chatExists) {
          chatExists = new Chat({ members: [user._id, recipient] });
          await chatExists.save();
        }

        const newMessage = new ChatMessage({
          chatId: chatExists!._id,
          text: message,
          recipient,
        });
        await newMessage.save();

        const allChatMessages = await ChatMessage.find({
          chatId: chatExists!._id,
        });

        socket.emit(
          "sendMessage",
          successRes("Message sent successfully", allChatMessages)
        );
      }
    } catch (err: any) {
      socket.emit("serverError", err.message);
    }
  });
};

export default socketControllers;
