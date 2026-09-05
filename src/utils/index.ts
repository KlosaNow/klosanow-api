import {
    badRequestError,
    internalServerError,
    notFoundError,
    unAuthorizedError,
    unsupportedMediaTypeError,
    unprocessableEntityError,
    badGatewayError,
} from "./CustomError";
import { errorRes, successRes } from "./CustomResponse";
import { CustomRequest, CustomSocket } from "./CustomInterfaces";
import { createJWT, verifyJWT, generateRefreshToken } from "./jwt";
import { isUserOnline } from "./socket";

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
    unsupportedMediaTypeError,
    unprocessableEntityError,
    badGatewayError,

    // JWT
    createJWT,
    verifyJWT,
    generateRefreshToken,

    // Presence
    isUserOnline,
};
