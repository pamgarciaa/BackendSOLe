import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: "user" | "moderator" | "admin";
    image: string;
    phone: string;
    address: string;
    resetPin?: string | null;
    resetPinExpires?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "moderator", "admin"],
            default: "user",
        },
        image: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        phone: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        resetPin: {
            type: String,
            default: null,
        },
        resetPinExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Hook para hashear la contraseña
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;