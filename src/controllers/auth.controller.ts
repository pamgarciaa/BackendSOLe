import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import authService from "../services/auth.service";
import generateToken from "../utils/generateJwt.util";
import AppError from "../utils/appError.util";
import { sendEmail } from "../utils/email.util";
import { uploadImageToFirebase, deleteImageFromFirebase } from "../utils/firebaseStorage.util";

interface IUserResponse {
    _id: string | Types.ObjectId;
    username: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
    image?: string;
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
    let uploadedImageUrl = "";

    try {
        const { username, name, lastName, email, password } = req.body;

        if (!username || !name || !lastName || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        if ((req as AuthRequest).file) {
            uploadedImageUrl = await uploadImageToFirebase(
                (req as AuthRequest).file!,
                "users",
                username || "user"
            );
        }

        const userData = {
            username,
            name,
            lastName,
            email,
            password,
            image: uploadedImageUrl || undefined,
        };

        const user = await authService.registerUser(userData);

        const userObj = user.toObject();
        delete (userObj as any).password;

        sendTokenResponse(userObj as IUserResponse, 201, res);
    } catch (error) {
        if (uploadedImageUrl) await deleteImageFromFirebase(uploadedImageUrl);
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
        const userId = req.params.id;

        const user = await authService.getUserById(userId);

        if (user && user.image && user.image.includes("storage.googleapis.com")) {
            await deleteImageFromFirebase(user.image);
        }

        await authService.deleteUser(userId);
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
    let uploadedImageUrl = "";

    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            return next(new AppError("User not authenticated", 401));
        }

        const userId = authReq.user._id.toString();
        const { name, address, lastName, phone, username, image } = req.body;

        const updates: Record<string, any> = { name, address, lastName, phone, username };

        if (image === "true" || image === true) {
            const currentPic = authReq.user.image;
            if (currentPic && currentPic.includes("storage.googleapis.com")) {
                await deleteImageFromFirebase(currentPic);
            }
            updates.image = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }
        else if (authReq.file) {
            uploadedImageUrl = await uploadImageToFirebase(
                authReq.file,
                "users",
                username || authReq.user.username || "updated_user"
            );
            updates.image = uploadedImageUrl;

            const currentPic = authReq.user.image;
            if (currentPic && currentPic.includes("storage.googleapis.com")) {
                await deleteImageFromFirebase(currentPic);
            }
        }

        Object.keys(updates).forEach(
            (key) => updates[key] === undefined && delete updates[key]
        );

        const updatedUser = await authService.updateProfile(
            userId,
            updates,
            undefined
        );

        res.status(200).json({
            status: "success",
            user: updatedUser,
        });
    } catch (error) {
        if (uploadedImageUrl) await deleteImageFromFirebase(uploadedImageUrl);
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
            return next(new AppError("User not authenticated", 401));
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
            "Password Recovery - El Camino",
            `Your recovery PIN is: ${pin}`
        );

        res.json({ message: "Email sent successfully with instructions" });
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
            return next(new AppError("PIN is required", 400));
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
                image: user.image,
                phone: user.phone || "",
                address: user.address || "",
            },
        });
};