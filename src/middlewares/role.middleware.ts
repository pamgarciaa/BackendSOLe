import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const checkRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        if (authReq.user && allowedRoles.includes(authReq.user.role)) {
            next();
        } else {
            res
                .status(403)
                .json({ message: "Access denied: Insufficient permissions" });
        }
    };
};