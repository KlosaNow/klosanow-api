import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Chat, User } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
    badRequestError,
} from "../../utils";
import { Message } from "../../utils/types";
import mongoose from "mongoose";

const deleteMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { user } = req;
        const { recipient } = req.params;
        const { text } = req.body;
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default deleteMessage;
