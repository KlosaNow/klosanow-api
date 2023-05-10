import mongoose from 'mongoose';
import validator from 'validator';

import { UserTypes } from '../utils/types';

const UserSchema = new mongoose.Schema<UserTypes>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a username'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number'],
      unique: true,
      validate: {
        validator: validator.isMobilePhone,
        message: 'Please provide valid phone number',
      },
    },
    role: {
      type: String,
      enum: ['tutor', 'student'],
      default: 'student',
    },
    createdLessons: {
      type: Array,
    },
    savedLessons: {
      type: Array,
    },
    notifications: [
      {
        type: String,
      },
    ]
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
