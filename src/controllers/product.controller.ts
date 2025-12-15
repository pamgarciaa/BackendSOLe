import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
import AppError from "../utils/appError.util";
import { uploadImageToFirebase, deleteImageFromFirebase } from "../utils/firebaseStorage.util";

interface AuthRequest extends Request {
    user?: {
        _id: string;
        [key: string]: any;
    };
    file?: Express.Multer.File;
}

// --- CREATE PRODUCT ---
export const createProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;
    let uploadedImageUrl = "";

    try {
        const {
            name,
            description,
            price,
            stock,
            category,
            features,
            isDigital,
        } = req.body;

        if (!authReq.file) {
            return next(new AppError("Image is required", 400));
        }

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        uploadedImageUrl = await uploadImageToFirebase(
            authReq.file,
            "products",
            name || "product"
        );

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
            isDigital: isDigital === "true" || isDigital === true,
            image: uploadedImageUrl,
            createdBy: authReq.user._id as any,
        };

        const newProduct = await productService.createProduct(productData);

        res.status(201).json({
            status: "success",
            data: { product: newProduct },
        });
    } catch (error) {
        if (uploadedImageUrl) {
            await deleteImageFromFirebase(uploadedImageUrl);
        }
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
        const products = await productService.getAllProducts({});

        res.status(200).json({
            status: "success",
            results: products.length,
            data: { products },
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
    let uploadedImageUrl = "";

    try {
        const { id } = req.params;
        let newImage = undefined;

        if (authReq.file) {
            uploadedImageUrl = await uploadImageToFirebase(
                authReq.file,
                "products",
                req.body.name || "product_updated"
            );
            newImage = uploadedImageUrl;
        }

        const updated = await productService.updateProduct(id, req.body, newImage);

        res.status(200).json({
            status: "success",
            data: { product: updated },
        });
    } catch (error) {
        if (uploadedImageUrl) {
            await deleteImageFromFirebase(uploadedImageUrl);
        }
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