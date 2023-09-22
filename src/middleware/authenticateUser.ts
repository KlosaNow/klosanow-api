import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { getCookies } from "../helpers";
import {
    errorRes,
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
    try {
        const user = req.user;
        if (user.role !== "admin") {
            throw unAuthorizedError("Unauthorized access");
        }
        next();
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export const authenticateUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let authKey: string | undefined;
        let token: string | undefined;
        const authHeader = req.headers.authorization;
        try {
            if (authHeader) {
                [authKey, token] = authHeader.split(" ");
                if (authKey === AUTH_KEY) {
                    if (token) {
                        const payload = verifyJWT(token);
                        req.user = payload.user;
                        return next();
                    }
                }
            }
            // If the authKey is invalid or there is no access token or it is invalid or expired, throw an error
            throw badRequestError("Invalid authorization token.");
        } catch (jwtError) {
            // Catch the error from the access token and check for a refresh token
            const cookies = req.headers.cookie;
            if (cookies) {
                const { refreshToken } = getCookies(cookies); 
                if (refreshToken) {
                    const payload = verifyJWT(refreshToken); // Assuming payload contains user info or user ID
                    req.user = payload.user;

                    // Create and send a new access token
                    const newAccessToken = await createJWT(payload.user);
                    res.cookie("accessToken", newAccessToken);
                    return next();
                }
            }
            // If the refresh token is also invalid, return an error
            throw unAuthorizedError("Authentication failed. Please try again.");
        }
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};
