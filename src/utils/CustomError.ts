const { StatusCodes } = require("http-status-codes");

class CustomError extends Error {
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    public status = "error";

    constructor(message: string) {
        super(message);
    }

    badRequest = () => {
        this.statusCode = StatusCodes.BAD_REQUEST;
        return this;
    };

    unAuthorized = () => {
        this.statusCode = StatusCodes.UNAUTHORIZED;
        return this;
    };

    notFound = () => {
        this.statusCode = StatusCodes.NOT_FOUND;
        return this;
    };
}

const createCustomError = (msg: string) => {
    return new CustomError(msg);
};

export const badRequestError = (msg: string) =>
    createCustomError(msg).badRequest();
export const unAuthorizedError = (msg: string) =>
    createCustomError(msg).unAuthorized();
export const notFoundError = (msg: string) => createCustomError(msg).notFound();
