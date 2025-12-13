import Order from "../models/order.model";
import AppError from "../utils/appError.util";

// GET USER ORDERS
const getUserOrders = async (userId: string) => {
    const orders = await Order.find({ user: userId })
        .populate("items.product", "name image")
        .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
        throw new AppError("No orders found", 404);
    }

    return orders;
};

// GET ALL ORDERS
const getAllOrders = async () => {
    const orders = await Order.find()
        .populate("user", "username email")
        .populate("items.product", "name")
        .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
        throw new AppError("No orders found in database", 404);
    }

    return orders;
};

export default { getUserOrders, getAllOrders };