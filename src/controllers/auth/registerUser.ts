import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { transformPhone } from "../../helpers";
import { User } from "../../models";
import { badRequestError, errorRes, successRes } from "../../utils";

const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, name, phoneNumber, role } = req.body;
        if (!email?.trim() || !name?.trim() || !phoneNumber?.trim()) {
            throw badRequestError("Please provide all required fields");
        }
        const phone = transformPhone(phoneNumber);

        // Check if a user with the passed email OR phone number exists
        const alreadyExists = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (alreadyExists) {
            throw badRequestError(
                "User with that email or phone number already exists"
            );
        }

        const newUser = new User({ email, name, phoneNumber: phone, role });
        await newUser.save();

        res.status(StatusCodes.CREATED).json(
            successRes("User created successfully. Log in.")
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default registerUser;
