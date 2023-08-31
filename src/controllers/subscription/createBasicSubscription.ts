import { CustomRequest } from "../../utils";
import { Subscription } from "../../models";
import { Response } from "express";
import { successRes, payWithPaystack } from "../../helpers";

const createBasicSubscription = async (req: CustomRequest, res: Response) => {
    const { subType } = req.body;
    let amount = 5000;
    const user = req.user;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    if (subType == "basic") {
        const sub = new Subscription({
            subscriptionType: subType,
            user: user._id,
            isActive: true,
            startDate: startDate,
            endDate: endDate,
        });
        await sub.save();
        const pay = payWithPaystack(amount, user.email, user.name).then(
            (data) => {
                return res
                    .status(200)
                    .json(successRes("Payment made successfully", data));
            }
        );
    }
};

export default createBasicSubscription;
