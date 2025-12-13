class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    // --- HELPER ESTÁTICO CON GENERICS ---
    static try<T>(
        object: T | null | undefined,
        message: string = "Resource not found",
        statusCode: number = 404
    ): T {
        if (!object) {
            throw new AppError(message, statusCode);
        }
        return object;
    }
}

export default AppError;