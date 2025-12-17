import { Request, Response, NextFunction } from "express";
import cartService from "@/services/cart.service";
import AppError from "@/utils/appError.util";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    [key: string]: any;
  };
}

// --- ADD TO CART ---
export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const { productId, quantity, productModel } = req.body;

    if (!productId || quantity === undefined) {
      return next(new AppError("Product ID and quantity are required", 400));
    }

    const cart = await cartService.addToCart(
      authReq.user._id,
      productId,
      quantity,
      productModel || 'Product'
    );

    if (!cart) {
      return next(new AppError("Cart update failed. Please try again.", 500));
    }

    res.status(200).json({
      status: "success",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};

// --- GET CART ---
export const getCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const cart = await cartService.getCart(authReq.user._id);

    res.status(200).json({
      status: "success",
      data: { cart: cart || { items: [] } },
    });
  } catch (error) {
    next(error);
  }
};

// --- CHECKOUT ---
export const checkoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return next(new AppError("Shipping address is required", 400));
    }

    const order = await cartService.checkout(authReq.user._id, shippingAddress);

    if (!order) {
      return next(new AppError("Purchase failed. Please try again.", 400));
    }

    res.status(201).json({
      status: "success",
      message: "Purchase successful",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

// --- DELETE ITEM FROM CART ---
export const deleteItemFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return next(new AppError("User not authenticated", 401));
    }

    const { productId } = req.params;

    if (!productId) {
      return next(new AppError("Product ID is required", 400));
    }

    const cart = await cartService.removeItemFromCart(
      authReq.user._id,
      productId
    );

    res.status(200).json({
      status: "success",
      message: "Item removed from cart",
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
};
