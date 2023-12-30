import {
    badRequestError,
    internalServerError,
    notFoundError,
    unAuthorizedError,
} from "./CustomError";
import { errorRes, successRes } from "./CustomResponse";
import { CustomRequest, CustomSocket } from "./CustomInterfaces";
import { createJWT, verifyJWT, generateRefreshToken } from "./jwt";

export {
    // Custom Responses
    errorRes,
    successRes,

    // Custom Interfaces
    CustomSocket,
    CustomRequest,

    // Errors
    badRequestError,
    internalServerError,
    notFoundError,
    unAuthorizedError,

    // JWT
    createJWT,
    verifyJWT,
    generateRefreshToken,
};
