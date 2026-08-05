import { Server } from "socket.io";

export const isUserOnline = (io: Server, userId: string) => {
	return (io.sockets.adapter.rooms.get(userId)?.size || 0) > 0;
};
