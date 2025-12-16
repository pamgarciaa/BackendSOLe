import crypto from "crypto";
import fs from "fs-extra";
import path from "path";
import User, { IUser } from "../models/user.model";
import AppError from "../utils/appError.util";

// --- REGISTER ---
const registerUser = async (userData: Partial<IUser>) => {
    const { username, email } = userData;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) throw new AppError("User or Email already exists", 409);

    return await User.create(userData);
};

// --- LOGIN ---
interface LoginArgs {
    email: string;
    password: string;
}

const loginUser = async ({ email, password }: LoginArgs) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Invalid credentials", 401);
    }
    return user;
};

// --- UPDATE PROFILE ---
const updateProfile = async (
    userId: string,
    updateData: Partial<IUser>,
    newFile?: Express.Multer.File
) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);


    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.lastName !== undefined) user.lastName = updateData.lastName;
    if (updateData.username !== undefined) user.username = updateData.username;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.address !== undefined) user.address = updateData.address;

    if (updateData.image !== undefined) {
        user.image = updateData.image;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete (updatedUser as any).password;

    return updatedUser;
};

// --- DELETE USER ---
const deleteUser = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    return AppError.try(user, "User not found");
};

// --- GET ALL ---
const getAllUsers = async () => {
    return await User.find().select("-password");
};

// --- GET ONE ---
const getUserById = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return AppError.try(user, "User not found");
};

// --- UPDATE PASSWORD ---
const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await User.findById(userId).select("+password");

    if (!user) throw new AppError("User not found", 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new AppError("La contraseña actual es incorrecta", 401);
    }
    user.password = newPassword;

    await user.save();

    return user;
};

// --- FORGOT PASSWORD ---
const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 404);

    const resetToken = crypto.randomInt(100000, 999999).toString();

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPin = hashedToken;
    user.resetPinExpires = new Date(Date.now() + 3600000);

    await user.save();

    return resetToken;
};

// --- RESET PASSWORD ---
const resetPassword = async (token: string, newPassword: string) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPin: hashedToken,
        resetPinExpires: { $gt: Date.now() },
    });

    if (!user) throw new AppError("Invalid or expired PIN", 400);

    user.password = newPassword;
    user.resetPin = null;
    user.resetPinExpires = null;

    await user.save();
    return true;
};

export default {
    registerUser,
    loginUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
};