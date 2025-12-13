import { Request, Response, NextFunction } from "express";

export interface HttpError extends Error {
    statusCode?: number;
    status?: string;
}

const errorMiddleware = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    console.error("ERROR:", err);

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errorMiddleware;