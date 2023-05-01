import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import {StatusCodes} from 'http-status-codes';

const errorHandlerMiddleware: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(', ');
    customError = {
      msg,
      statusCode: 400,
    };
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError = {
      msg: `No item with id ${err.value} found`,
      statusCode: 404,
    };
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
