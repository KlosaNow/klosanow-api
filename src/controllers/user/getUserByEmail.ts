import { CustomRequest } from '../../utils';
import { User } from '../../models';
import { Response } from 'express';
import { successRes } from '../../helpers';
import { notFoundError } from '../../utils/CustomError';

const getUserByEmail = async (req: CustomRequest, res: Response) => {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if(!user) throw notFoundError('User not found')
    res.status(200).json(successRes('User returned successfully', user));
}

export default getUserByEmail;