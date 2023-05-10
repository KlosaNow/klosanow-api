import { CustomRequest } from '../../utils';
import User from '../../models/User';
import { Request, Response } from 'express';

const getAllUsers = (req: CustomRequest, res: Response) => {
    const { user } = req;

    console.log(user)
    res.send(user)
}

export default getAllUsers;