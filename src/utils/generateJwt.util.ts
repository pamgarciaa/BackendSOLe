import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface UserPayload {
    _id: string | Types.ObjectId;
    role: string;
}

// GENERATE JWT
const generateToken = (user: UserPayload): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        secret,
        {
            expiresIn: "1h",
        }
    );
};

export default generateToken;