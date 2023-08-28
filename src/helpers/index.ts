import { getUserByEmailRequest, createUserRequest } from './requesters';
import { otpGenerator, tokenGenerator, refGenerator, transformPhone } from './generators';
import {
  emailValidator,
  requiredFieldsValidator,
  phoneNumberValidator,
} from './validators';

import { successRes, errorRes } from './response';
import { payWithPaystack } from './payment'

export {
  // Requesters
  getUserByEmailRequest,
  createUserRequest,

  // Generators
  otpGenerator,
  tokenGenerator,
  refGenerator,
  transformPhone,

  // Validators
  requiredFieldsValidator,
  emailValidator,
  phoneNumberValidator,
  successRes,
  errorRes,

  // Payment
  payWithPaystack,
};
