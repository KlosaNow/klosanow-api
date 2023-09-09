import { Response, NextFunction } from "express";

import {
    createJWT,
    verifyJWT,
    CustomRequest,
    badRequestError,
    unAuthorizedError,
} from "../utils";

const AUTH_KEY = "Bearer";

export const authenticateAdminUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    if (user.role !== "admin") {
        throw unAuthorizedError("Unauthorized access");
    }
    next();
};

export const authenticateUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    let authkey: string | undefined;
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        [authkey, token] = authHeader.split(" ");
        if (authkey !== AUTH_KEY) {
            throw badRequestError("Invalid authorization token.");
        }
        if (token) {
            const payload = verifyJWT(token);
            req.user = payload.user;
            return next();
        } else {
            const refreshToken = req.cookies.refreshToken; // Assuming refresh token is stored in cookies
            if (refreshToken) {
                const payload = verifyJWT(refreshToken);
                // Assuming payload contains user info or user ID
                const newAccessToken = createJWT(payload.user);
                req.user = payload.user;
                res.cookie("accessToken", newAccessToken); // Send the new access token
                return next();
            }
        }
    }
    // If no authheader, access token or refresh token was provided, return an error
    throw unAuthorizedError("Authentication failed. Please try again.");
};
