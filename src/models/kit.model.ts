import mongoose, { Document, Schema, Model } from "mongoose";

export interface IKit extends Document {
    name: string;
    description: string;
    price?: number;
    image: string;
    features: string[];
    isDigital: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const kitSchema = new Schema<IKit>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: false, min: 0 },
        image: { type: String, required: true },
        features: [{ type: String }],
        isDigital: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

const Kit: Model<IKit> = mongoose.model<IKit>("Kit", kitSchema);
export default Kit;