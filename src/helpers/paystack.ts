import dotenv from 'dotenv'
dotenv.config()
import randToken from 'rand-token'
import * as paystack from 'paystack'
import { errorRes } from './response'
const p = paystack.default(`${process.env.PAYSTACK_SECRET_KEY}`)

const makePayment = async(amount: number, email: string, name: string) => {
    try {        
        const key = process.env.PAYSTACK_SECRET_KEY
        const pre = 'KLSN'
        const random = randToken.generate(7)
        const ref = pre + random
        const init = await p.transaction.initialize({
            key: key,
            amount: amount * 100,
            email: email,
            name: name,
            reference: ref
        })
        return init
    }
    catch(err: any){
        return errorRes(err.message)
    }

}

export default makePayment