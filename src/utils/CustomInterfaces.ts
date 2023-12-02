import { Request } from "express";
import { Socket } from "socket.io";

interface CustomRequest extends Request {
  user?: any;
  file?: any;
}

interface CustomSocket extends Socket {
  user?: any;
}

export { CustomRequest, CustomSocket };
