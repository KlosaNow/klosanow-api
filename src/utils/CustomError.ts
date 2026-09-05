import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
    public status = "error";
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    constructor(message: string) {
        super(message);
    }

    badRequest = () => {
        this.statusCode = StatusCodes.BAD_REQUEST;
        return this;
    };

    notFound = () => {
        this.statusCode = StatusCodes.NOT_FOUND;
        return this;
    };

    serverFailure = () => {
        return this;
    };

    unAuthorized = () => {
        this.statusCode = StatusCodes.UNAUTHORIZED;
        return this;
    };

    unsupportedMediaType = () => {
        this.statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
        return this;
    };

    unprocessableEntity = () => {
        this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
        return this;
    };

    badGateway = () => {
        this.statusCode = StatusCodes.BAD_GATEWAY;
        return this;
    };
}

const createCustomError = (msg: string) => {
    return new CustomError(msg);
};

export const badRequestError = (msg: string) =>
    createCustomError(msg).badRequest();

export const internalServerError = (msg: string) =>
    createCustomError(msg).serverFailure();

export const unAuthorizedError = (msg: string) =>
    createCustomError(msg).unAuthorized();

export const notFoundError = (msg: string) => createCustomError(msg).notFound();

export const unsupportedMediaTypeError = (msg: string) =>
    createCustomError(msg).unsupportedMediaType();

export const unprocessableEntityError = (msg: string) =>
    createCustomError(msg).unprocessableEntity();

export const badGatewayError = (msg: string) =>
    createCustomError(msg).badGateway();
