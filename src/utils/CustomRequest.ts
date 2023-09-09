import { Request } from "express";

interface CustomRequest extends Request {
    user?: any;
    file?: any;
}

export default CustomRequest;
