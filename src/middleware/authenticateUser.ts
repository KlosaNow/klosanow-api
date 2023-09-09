import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

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
        let authkey: string | undefined;
        let token: string | undefined;
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (authHeader) {
            [authkey, token] = authHeader.split(" ");
            if (authkey !== AUTH_KEY) {
                throw badRequestError("Invalid authorization token.");
            }
            if (token) {
                const payload = verifyJWT(token);
                console.log(payload);
                req.user = payload.user;
                return next();
            }
        }
        // If there is no access token or it is invalid or expired, check for a refresh token
        console.log(req)
        const refreshToken = req.cookies.refreshToken; // Assuming refresh token is stored in cookies
        if (refreshToken) {
            const payload = verifyJWT(refreshToken);
            // Assuming payload contains user info or user ID
            const newAccessToken = createJWT(payload.user);
            req.user = payload.user;
            res.cookie("accessToken", newAccessToken); // Send the new access token
            return next();
        }
        // If no authheader, access token or refresh token was provided, return an error
        throw unAuthorizedError("Authentication failed. Please try again.");
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};
