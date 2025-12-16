import { Request, Response, NextFunction } from "express";
import kitService from "../services/kit.service";
import AppError from "../utils/appError.util";
import { uploadImageToFirebase, deleteImageFromFirebase } from "../utils/firebaseStorage.util";

interface AuthRequest extends Request {
    file?: Express.Multer.File;
}

// --- GET ALL KITS ---
export const getAllKitsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Headers Anti-Caché
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        const kits = await kitService.getAllKits();
        res.status(200).json({
            status: "success",
            results: kits.length,
            data: { kits },
        });
    } catch (error) {
        next(error);
    }
};

// --- GET ONE KIT ---
export const getKitByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Headers Anti-Caché
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        const { id } = req.params;
        const kit = await kitService.getKitById(id);
        res.status(200).json({ status: "success", data: { kit } });
    } catch (error) {
        next(error);
    }
};

// --- CREATE KIT ---
export const createKitController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;
    let uploadedImageUrl = "";

    try {
        const { name, description, price, features, level, isDigital } = req.body;

        if (!authReq.file) {
            return next(new AppError("Image is required for the kit", 400));
        }

        uploadedImageUrl = await uploadImageToFirebase(
            authReq.file,
            "kits",
            name || "kit"
        );

        let parsedFeatures: string[] = [];
        if (typeof features === "string") {
            parsedFeatures = features.split(",").map((f: string) => f.trim());
        } else if (Array.isArray(features)) {
            parsedFeatures = features;
        }

        const kitData = {
            name,
            description,
            price,
            features: parsedFeatures,
            level: Number(level),
            isDigital: isDigital === "true" || isDigital === true,
            image: uploadedImageUrl,
        };

        const newKit = await kitService.createKit(kitData);

        res.status(201).json({
            status: "success",
            data: { kit: newKit },
        });
    } catch (error) {
        if (uploadedImageUrl) await deleteImageFromFirebase(uploadedImageUrl);
        next(error);
    }
};

// --- UPDATE KIT ---
export const updateKitController = async (
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
                "kits",
                req.body.name || "kit_updated"
            );
            newImage = uploadedImageUrl;
        }

        const updatedKit = await kitService.updateKit(id, req.body, newImage);

        res.status(200).json({
            status: "success",
            data: { kit: updatedKit },
        });
    } catch (error) {
        if (uploadedImageUrl) await deleteImageFromFirebase(uploadedImageUrl);
        next(error);
    }
};

// --- DELETE KIT ---
export const deleteKitController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const kit = await kitService.deleteKit(req.params.id);

        if (kit.image) {
            await deleteImageFromFirebase(kit.image);
        }

        res.status(200).json({
            status: "success",
            message: "Kit deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};