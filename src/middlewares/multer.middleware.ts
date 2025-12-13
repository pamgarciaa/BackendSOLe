import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs-extra";
import path from "path";
import { AuthRequest } from "./auth.middleware";

// 1. HELPER
export const cleanFileName = (fileName: string): string => {
    if (!fileName) return "unknown";
    return fileName
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};

// 2. FACTORY
export const createUploadMiddleware = (subfolder: string) => {
    const finalPath = path.join("uploads", subfolder);
    fs.ensureDirSync(finalPath);

    const storage = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, destination: string) => void
        ) => {
            cb(null, finalPath);
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, filename: string) => void
        ) => {
            let finalName = "file";
            const authReq = req as AuthRequest;

            if (authReq.user && authReq.user.username) {
                finalName = authReq.user.username;
            } else {
                finalName =
                    req.body.username || req.body.title || req.body.product || "unknown";
            }

            const cleanName = cleanFileName(finalName);
            const uniqueSuffix = Date.now();

            cb(
                null,
                `${subfolder}-${cleanName}-${uniqueSuffix}${path.extname(
                    file.originalname
                )}`
            );
        },
    });

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("invalid file type"));
        }
    };

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 1024 * 1024 * 5 },
    });
};