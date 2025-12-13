import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
    user?: IUser | null;
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;
    const authReq = req as AuthRequest;

    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as JwtPayload;

            authReq.user = await User.findById(decoded.id).select("-password");

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized: invalid token" });
        }
    }

    return res.status(401).json({ message: "Not authorized: no token" });
};