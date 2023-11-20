import mongoose from "mongoose";
import validator from "validator";

import { UserType } from "../utils/types";

const UserSchema = new mongoose.Schema<UserType>(
    {
        name: {
            type: String,
            required: [true, "Please provide a username"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: "Please provide valid email",
            },
        },
        phoneNumber: {
            type: String,
            required: [true, "Please provide a phone number"],
            unique: true,
            validate: {
                validator: validator.isMobilePhone,
                message: "Please provide valid phone number",
            },
        },
        role: {
            type: String,
            enum: ["tutor", "student", "admin"],
            default: "student",
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
        ],
        storageUsage: {
            type: Number,
            default: 0, // Initial storage usage
        },
        maxStorageLimit: {
            type: Number,
            default: 1024 * 1024 * 500, // Default max storage limit 500 MB
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
