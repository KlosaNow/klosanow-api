import { Request, Response, NextFunction } from "express";

export const requiredFieldsValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const REQUIRED_FIELDS: {
        [key: string]: { verboseName: string; data?: string };
    } = {
        username: { verboseName: "Username" },
        emailAddress: { verboseName: "Email address" },
        phoneNumber: { verboseName: "Phone number" },
    };

    // Loop through the key of the required fields array
    // and store the data passed to each field from the request
    // Trim off whitespace from the data except the password
    for (const field in REQUIRED_FIELDS) {
        REQUIRED_FIELDS[field].data = req.body[field].trim();
    }

    // Loop through the required fields object and
    // check if any of the required fields is empty
    Object.keys(REQUIRED_FIELDS).forEach((key) => {
        if (!REQUIRED_FIELDS[key].data) {
            return res.status(400).json({
                status: "error",
                message: `${REQUIRED_FIELDS[key].verboseName} is required`,
            });
        }
    });

    next();
};

export const emailValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email = req.body.emailAddress.trim();

    const splitForAt = email.split("@"); // Splits the "nelson@klosanow.com" into "nelson" and "klosanow.com"
    const splitForDomain = (splitForAt[1] || " ").split("."); // Splits the "klosanow.com" into "klosanow" and "com"
    const invalidEmailError = () => {
        res.status(400).json({
            status: "error",
            message: "Invalid email address",
        });
    };

    switch (true) {
        case email.length > 254: // Check if the email address is more than 254 characters long
            return invalidEmailError();

        case splitForAt.length < 2: // Checks for the presence of "@" in the passed email address
            return invalidEmailError();

        case splitForAt[0].trim().length < 2: // Checks if the username is less than two characters long
            console.log(splitForAt);
            return invalidEmailError();

        case splitForDomain.length < 2: // Checks for the presence of a domain extension (.com, .org)
            return invalidEmailError();

        case splitForDomain[1].trim().length < 1: // Checks if the domain name is less than a characters long
            return invalidEmailError();

        case splitForDomain[1].trim().length < 2: // Checks if the domain extension is less than two characters long
            return invalidEmailError();

        default:
            next();
    }
};

export const phoneNumberValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const phoneNumber = req.body.phoneNumber.trim();

    // Remove dashes and spaces from the phone number
    const onlyDigitsPhoneNumber = phoneNumber
        .split("-")
        .join("")
        .split(" ")
        .join("");

    // Regular expression to check if the phone number is either
    // 10 digits long or
    // 11 digits long and starts with 0
    const phoneNumberRegex = new RegExp(/^(?=.{10,11}$)(0\d{10}|\d{10})$/);
    const invalidPhoneNumberError = () => {
        res.status(400).json({
            status: "error",
            message: "Invalid phone number",
        });
    };

    if (!phoneNumberRegex.test(onlyDigitsPhoneNumber)) {
        return invalidPhoneNumberError();
    } else {
        next();
    }
};
