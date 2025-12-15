import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

//función helper cleanFileName
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

export const createUploadMiddleware = (subfolder: string) => {
    const storage = multer.memoryStorage();

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
        limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    });
};