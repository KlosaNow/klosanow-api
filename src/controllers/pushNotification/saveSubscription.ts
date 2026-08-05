import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { PushSubscription } from "../../models";
import { badRequestError, CustomRequest, errorRes, successRes } from "../../utils";

const saveSubscription = async (req: CustomRequest, res: Response) => {
	try {
		const { endpoint, keys } = req.body;

		if (!endpoint?.trim() || !keys?.p256dh?.trim() || !keys?.auth?.trim()) {
			throw badRequestError(
				"`endpoint` and `keys` (with `p256dh` and `auth`) fields are required"
			);
		}

		const subscription = await PushSubscription.findOneAndUpdate(
			{ endpoint },
			{
				endpoint,
				keys,
				user: req.user._id,
				userAgent: req.headers["user-agent"],
			},
			{ upsert: true, new: true }
		);

		res.status(StatusCodes.OK).json(
			successRes("Push subscription saved successfully", subscription)
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default saveSubscription;
