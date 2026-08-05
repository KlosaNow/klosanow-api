import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CustomRequest, errorRes, internalServerError, successRes } from "../../utils";
import { VAPID_PUBLIC_KEY } from "../../utils/config";

const getVapidPublicKey = async (req: CustomRequest, res: Response) => {
	try {
		if (!VAPID_PUBLIC_KEY) {
			throw internalServerError("Missing VAPID_PUBLIC_KEY environment variable");
		}

		res.status(StatusCodes.OK).json(
			successRes("VAPID public key returned successfully", {
				publicKey: VAPID_PUBLIC_KEY,
			})
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default getVapidPublicKey;
