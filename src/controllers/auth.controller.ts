import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import authService from "@/services/auth.service";
import generateToken from "@/utils/generateJwt.util";
import AppError from "@/utils/appError.util";
import { sendEmail } from "@/utils/email.util";

interface IUserResponse {
    _id: string | Types.ObjectId;
    username: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
    profilePicture?: string;
    phone?: string;
    address?: string;
}

interface AuthRequest extends Request {
    user?: IUserResponse;
    file?: Express.Multer.File;
}

// --- REGISTER ---
export const registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, name, lastName, email, password } = req.body;

        if (!username || !name || !lastName || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        const userData = {
            username,
            name,
            lastName,
            email,
            password,
            profilePicture: (req as AuthRequest).file ? (req as AuthRequest).file!.filename : undefined,
        };

        const user = await authService.registerUser(userData);

        const userObj = user.toObject();
        delete (userObj as any).password;

        sendTokenResponse(userObj as IUserResponse, 201, res);
    } catch (error) {
        next(error);
    }
};

// --- LOGIN ---
export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        const user = await authService.loginUser({ email, password });

        const userObj = user.toObject();
        delete (userObj as any).password;

        sendTokenResponse(userObj as IUserResponse, 200, res);
    } catch (error) {
        next(error);
    }
};

// --- LOGOUT ---
export const logoutController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};

// --- DELETE USER ---
export const removeUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await authService.deleteUser(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// --- GET ALL USERS ---
export const getAllUsersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// --- GET ONE USER ---
export const getUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// --- UPDATE USER ---
export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        const userId = authReq.user._id.toString();
        const { name, address, lastName, phone, username } = req.body;

        const updates: Record<string, any> = { name, address, lastName, phone, username };

        Object.keys(updates).forEach(
            (key) => updates[key] === undefined && delete updates[key]
        );

        const updatedUser = await authService.updateProfile(
            userId,
            updates,
            authReq.file
        );

        res.status(200).json({
            status: "success",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

// --- UPDATE PASSWORD ---
export const updatePasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password } = req.body;
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        const userId = authReq.user._id.toString();

        if (!password) {
            return next(new AppError("Password is required", 400));
        }

        await authService.updatePassword(userId, password);
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

// --- FORGOT PASSWORD ---
export const forgotPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        const pin = await authService.forgotPassword(email);

        await sendEmail(
            email,
            "Recuperación de Contraseña - El Camino",
            `Tu PIN de recuperación es: ${pin}`
        );

        res.json({ message: "Email enviado correctamente con las instrucciones" });
    } catch (error) {
        next(error);
    }
};

// --- RESET PASSWORD ---
export const resetPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { pin, password } = req.body;

        if (!pin) {
            return next(new AppError("El PIN es obligatorio", 400));
        }

        const cleanPin = String(pin).trim();
        await authService.resetPassword(cleanPin, password);

        res.json({ message: "Password reset successful" });
    } catch (error) {
        next(error);
    }
};

// --- HELPER (Send Token) ---
const sendTokenResponse = (user: IUserResponse, statusCode: number, res: Response) => {
    const token = generateToken({ _id: user._id, role: user.role });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict",
    };

    res
        .status(statusCode)
        .cookie("jwt", token, options)
        .json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                phone: user.phone || "",
                address: user.address || "",
            },
        });
};