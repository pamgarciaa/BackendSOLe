import mongoose, { Document, Schema, Model } from "mongoose";

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
    _id?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: "pending" | "paid" | "shipped" | "delivered";
    shippingAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, required: true },
                priceAtPurchase: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered"],
            default: "pending",
        },
        shippingAddress: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;