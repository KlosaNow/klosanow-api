import { CustomRequest } from '../../utils';
import { User } from '../../models';
import { Response } from 'express';
import { successRes } from '../../helpers';

const getAllUsers = async (req: CustomRequest, res: Response) => {
  const users = await User.find({});
  res.status(200).json(successRes('Users returned successfully', users));
};

export default getAllUsers;
