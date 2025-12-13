import { Request, Response, NextFunction } from "express";
import orderService from "@/services/order.service";
import AppError from "@/utils/appError.util";
interface AuthRequest extends Request {
    user?: {
        _id: string;
        [key: string]: any;
    };
}

// --- GET MY ORDERS (Usuario logueado) ---
export const getMyOrdersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        const orders = await orderService.getUserOrders(authReq.user._id);

        res.status(200).json({
            status: "success",
            results: orders.length,
            data: { orders },
        });
    } catch (error) {
        next(error);
    }
};

// --- GET ALL ORDERS (Admin) ---
export const getAllOrdersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const orders = await orderService.getAllOrders();

        res.status(200).json({
            status: "success",
            results: orders.length,
            data: { orders },
        });
    } catch (error) {
        next(error);
    }
};