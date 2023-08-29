import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils";
import { unAuthorizedError } from "../utils/CustomError";

const authenticateAdminUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const { user } = req;
    if (user.role !== "admin") {
        throw unAuthorizedError("Unauthorized access");
    }
    next();
};

export default authenticateAdminUser;
