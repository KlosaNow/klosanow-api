export interface UserTypes {
    _id: string;
    username: string;
    email: {
        validate: {
            validator: (arg0: string) => boolean;
            message: string;
        }
    };
    phoneNumber: {
        validate: {
            validator: (arg0: string) => boolean;
            message: string;
        }
    };
    role: string;
    verificationToken: string;
    isVerified: boolean;
    verified: Date;
    passwordToken: string;
    passwordTokenExpiration: Date;
    createdAt: Date;
    updatedAt: Date;
}