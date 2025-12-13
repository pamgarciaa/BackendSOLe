import { Request, Response, NextFunction } from "express";
import fs from "fs-extra";
import productService from "@/services/product.service";
import AppError from "@/utils/appError.util";

interface AuthRequest extends Request {
    user?: {
        _id: string;
        [key: string]: any;
    };
    file?: Express.Multer.File;
}

interface IProductWithLevel {
    level: number;
    [key: string]: any;
}

// --- CREATE PRODUCT ---
export const createProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;

    try {
        const {
            name,
            description,
            price,
            stock,
            category,
            features,
            level,
            isDigital,
        } = req.body;

        if (!authReq.file) {
            return next(new AppError("Image is required", 400));
        }

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        let parsedFeatures: string[] = [];
        if (typeof features === "string") {
            parsedFeatures = features.split(",").map((f: string) => f.trim());
        } else if (Array.isArray(features)) {
            parsedFeatures = features;
        }

        const productData = {
            name,
            description,
            price,
            stock,
            category,
            features: parsedFeatures,
            level: level ? Number(level) : undefined,
            isDigital: isDigital === "true" || isDigital === true,
            image: authReq.file.filename,
            createdBy: authReq.user._id as any,
        };

        const newProduct = await productService.createProduct(productData);

        res.status(201).json({
            status: "success",
            data: { product: newProduct },
        });
    } catch (error) {
        if (authReq.file) await fs.remove(authReq.file.path);
        next(error);
    }
};

// --- GET ALL PRODUCTS ---
export const getAllProductsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const filter = { category: { $ne: "kit" } };
        const products = await productService.getAllProducts(filter);

        res.status(200).json({
            status: "success",
            results: products.length,
            data: { products },
        });
    } catch (error) {
        next(error);
    }
};

// --- GET ALL KITS ---
export const getAllKitsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const filter = { category: "kit" };

        const kits = (await productService.getAllProducts(filter)) as IProductWithLevel[];

        kits.sort((a, b) => (a.level || 0) - (b.level || 0));

        res.status(200).json({
            status: "success",
            results: kits.length,
            data: { kits },
        });
    } catch (error) {
        next(error);
    }
};

// --- UPDATE PRODUCT ---
export const updateProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;

    try {
        const { id } = req.params;
        const newImage = authReq.file ? authReq.file.filename : undefined;

        const updated = await productService.updateProduct(id, req.body, newImage);

        res.status(200).json({
            status: "success",
            data: { product: updated },
        });
    } catch (error) {
        if (authReq.file) await fs.remove(authReq.file.path);
        next(error);
    }
};

// --- DELETE PRODUCT ---
export const deleteProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await productService.deleteProduct(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};