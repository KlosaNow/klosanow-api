import { CustomRequest } from '../../utils';
import User from '../../models/User';
import { Response } from 'express';
import { successRes } from '../../helpers';
import { notFoundError } from '../../utils/CustomError';

const getUserById = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if(!user) throw notFoundError('User not found')
    res.status(200).json(successRes('User returned successfully', user));
}

export default getUserById;