import mongoose, { Document, Schema, Model } from "mongoose";

export interface IKitRequest extends Document {
    kitName: string;
    name: string;
    email: string;
    message?: string;
    status: "pending" | "contacted" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const kitRequestSchema = new Schema<IKitRequest>(
    {
        kitName: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Formato de email inválido"],
        },
        message: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "contacted", "closed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const KitRequest: Model<IKitRequest> = mongoose.model<IKitRequest>("KitRequest", kitRequestSchema);
export default KitRequest;