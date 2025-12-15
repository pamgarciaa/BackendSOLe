import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.config";
import AppError from "../src/utils/appError.util";

import errorMiddleware from "../src/middlewares/error.middleware";
import loggerMiddleware from "../src/middlewares/logger.middleware";

import authRoutes from "../src/routes/auth.route";
import blogRoutes from "../src/routes/blog.route";
import productRoutes from "../src/routes/product.route";
import kitRoutes from "../src/routes/kit.route"
import orderRoutes from "../src/routes/order.route";
import cartRoutes from "../src/routes/cart.route";
import kitRequestRoutes from "../src/routes/kitrequest.route"


dotenv.config();

export const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);


app.use("/api/users", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/kitrequests", kitRequestRoutes);


app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}