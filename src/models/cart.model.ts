import mongoose, { Document, Schema, Model } from "mongoose";

interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  productModel: "Product" | "Kit";
  _id?: mongoose.Types.ObjectId;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "items.productModel",
        },
        productModel: {
          type: String,
          required: true,
          enum: ["Product", "Kit"],
          default: "Product",
        },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;