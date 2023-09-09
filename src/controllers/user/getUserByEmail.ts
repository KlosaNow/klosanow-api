import { Response } from "express";

import { User } from "../../models";
import { successRes } from "../../helpers";
import { CustomRequest, notFoundError } from "../../utils";

const getUserByEmail = async (req: CustomRequest, res: Response) => {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) throw notFoundError("User not found");
    res.status(200).json(successRes("User returned successfully", user));
};

export default getUserByEmail;
