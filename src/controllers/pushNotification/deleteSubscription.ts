import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { PushSubscription } from "../../models";
import {
	badRequestError,
	CustomRequest,
	errorRes,
	notFoundError,
	successRes,
} from "../../utils";

const deleteSubscription = async (req: CustomRequest, res: Response) => {
	try {
		const { endpoint } = req.body;

		if (!endpoint?.trim()) {
			throw badRequestError("`endpoint` field is required");
		}

		const subscription = await PushSubscription.findOne({ endpoint });
		if (!subscription) throw notFoundError("Push subscription not found");

		await subscription.deleteOne();

		res.status(StatusCodes.OK).json(
			successRes("Push subscription deleted successfully")
		);
	} catch (err: any) {
		res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
			errorRes(err.message)
		);
	}
};

export default deleteSubscription;
