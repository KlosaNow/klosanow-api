import { CustomRequest, verifyJWT } from '../utils';
import { Request, Response, NextFunction } from 'express';

import User from '../models/User'

export const getUser = async (req: CustomRequest,res: Response,next: NextFunction)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return next('Please login to access the data');
        }
        const verify = await verifyJWT(token);
        req.user = await User.findById(verify.id);
        next();
    } catch (error) {
       return next(error); 
    }
}

;