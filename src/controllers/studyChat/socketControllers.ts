import { StudyChat, StudyChatMessage, User } from "../../models";
import { CustomSocket, errorRes, successRes } from "../../utils";

const socketControllers = (socket: CustomSocket) => {
    // Listen for a "getAllStudyChats" event
    socket.on("getAllStudyChats", async () => {
        try {
            const { user } = socket;
            const studyChats = await StudyChat.find({
                members: { $in: [user._id] },
            })
                .sort({ updatedAt: -1 })
                .exec();

            socket.emit(
                "getAllStudyChats",
                successRes("StudyChats returned successfully", studyChats)
            );
        } catch (err: any) {
            socket.emit("serverError", err.message);
        }
    });

    // Listen for a "getStudyChatById" event
    socket.on("getStudyChatById", async (id) => {
        try {
            const studyChat = await StudyChat.findOne({ _id: id });
            if (!studyChat) {
                return socket.emit(
                    "getStudyChatById",
                    errorRes("StudyChat not found")
                );
            } else {
                const allStudyChatMessages = await StudyChatMessage.find({
                    StudyChatId: studyChat._id,
                });

                socket.emit(
                    "getStudyChatById",
                    successRes(
                        "StudyChat returned successfully",
                        allStudyChatMessages
                    )
                );
            }
        } catch (err: any) {
            socket.emit("serverError", err.message);
        }
    });

    // Listen for a "createStudyChat" event
    socket.on("createStudyChat", async (data) => {
        try {
            let { user } = socket;
            user = User.findOne({ _id: user._id });

            if (user.studyChats.owns.length > 1) {
                return socket.emit(
                    "createStudyChat",
                    errorRes("A user cannot only create one study chat")
                );
            }

            const { title, photoUrl, members } = data;
            if (!title?.trim()) {
                return socket.emit(
                    "createStudyChat",
                    errorRes("Study chat title is required")
                );
            } else if (members.length > 20) {
                return socket.emit(
                    "createStudyChat",
                    errorRes("A Study chat cannot have more than 20 members")
                );
            } else {
                const newStudyChat = new StudyChat({
                    title,
                    members,
                    photoUrl,
                    owner: user._id,
                });
                await newStudyChat.save();

                // Update the number of study chats a user owns
                user.studyChats.owns.push(newStudyChat._id);
                await user.save();

                return socket.emit(
                    "createStudyChat",
                    successRes("Study chat created successfully")
                );
            }
        } catch (err: any) {
            socket.emit("serverError", err.message);
        }
    });

    // Listen for a "deleteStudyChatById" event
    socket.on("deleteStudyChatById", async (id) => {
        try {
            const studyChat = await StudyChat.findOne({ _id: id });
            if (!studyChat) {
                return socket.emit(
                    "deleteStudyChatById",
                    errorRes("StudyChat not found")
                );
            } else {
                await StudyChatMessage.deleteMany({
                    StudyChatId: studyChat._id,
                });
                await studyChat.deleteOne({ StudyChat });

                socket.emit(
                    "deleteStudyChatById",
                    successRes("StudyChat deleted successfully")
                );
            }
        } catch (err: any) {
            socket.emit("serverError", err.message);
        }
    });

    // Listen for a "addMembers" event
    socket.on("addMembers", async (data) => {
        try {
            const { studyChatId, members } = data;
            const studyChat = await StudyChat.findOne({ _id: studyChatId });
            if (!studyChat) {
                return socket.emit(
                    "addMembers",
                    errorRes("Study chat not found")
                );
            }

            if (studyChat.members.length + members.length > 20) {
                return socket.emit(
                    "addMembers",
                    errorRes("A Study chat cannot have more than 20 members")
                );
            }

            members.forEach((member: any) => studyChat.members.push(member));
            return socket.emit(
                "addMembers",
                successRes("Members added successfully")
            );
        } catch (err: any) {
            socket.emit("serverError", err.message);
        }
    });

    // Listen for a "sendMessage" event
    socket.on("sendMessage", async (data) => {
        try {
            const { user } = socket;

            const { studyChatId, message } = data;
            if (!studyChatId?.trim() || !message?.trim()) {
                return socket.emit(
                    "sendMessage",
                    errorRes("Study chat id and message text are required,")
                );
            }

            const studyChatExists = await StudyChat.findOne({
                _id: studyChatId,
                members: { $in: [user._id] },
            }).exec();
            if (!studyChatExists) {
                return socket.emit(
                    "sendMessage",
                    errorRes("Study chat not found")
                );
            }

            const newMessage = new StudyChatMessage({
                studyChatId: studyChatExists!._id,
                text: message,
            });
            await newMessage.save();

            const allStudyChatMessages = await StudyChatMessage.find({
                studyChatId: studyChatExists!._id,
            });

            socket.emit(
                "sendMessage",
                successRes("Message sent successfully", allStudyChatMessages)
            );
        } catch (err: any) {
            socket.emit("serverError", err.message);
        }
    });
};

export default socketControllers;
