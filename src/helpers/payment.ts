import * as paystack from "paystack";
import { Transaction, User } from "../models";
import { refGenerator } from "./generators";
import { errorRes } from "./response";
import dotenv from "dotenv";
dotenv.config();


export const payWithPaystack = async (amount: number, email: string, name: string) => {
    const PAYMENT_GATEWAY = "Paystack";
    const p = paystack.default(`${process.env.PAYSTACK_SECRET_KEY}`);
    
    try {
        const key = process.env.PAYSTACK_SECRET_KEY;
        const ref = await refGenerator();
        const user = await User.findOne({ email: email });
        
        const newTransaction = new Transaction({
            user: user,
            ref: ref,
            gateway: PAYMENT_GATEWAY,
        });
        
        const init = await p.transaction.initialize({
            key: key,
            amount: amount * 100,
            email: email,
            name: name,
            reference: ref,
        });
        
        // if there is a way to get the transaction status from paystack,
        // then, newTransaction.status should updated here
        await newTransaction.save();
        return init;

    } catch (err: any) {
    return errorRes(err.message);
    }
};
