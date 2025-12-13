import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    features: string[];
    level?: number;
    isDigital: boolean;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
        category: { type: String, required: true },
        image: { type: String, required: true },

        features: [{ type: String }],
        level: { type: Number },
        isDigital: { type: Boolean, default: false },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true, versionKey: false }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;