import { Request, Response, NextFunction } from "express";
import blogService from "@/services/blog.service";
import AppError from "@/utils/appError.util";
import { Types } from "mongoose";
import { uploadImageToFirebase, deleteImageFromFirebase } from "@/utils/firebaseStorage.util";

interface AuthUser {
    _id: string | Types.ObjectId;
    [key: string]: any;
}

interface AuthRequest extends Request {
    user?: AuthUser;
    file?: Express.Multer.File;
}

// --- CREATE ---
export const createBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;
    let uploadedImageUrl = "";

    try {
        const { title, content } = req.body;

        if (!authReq.file) {
            return next(new AppError("Please upload an image", 400));
        }

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        uploadedImageUrl = await uploadImageToFirebase(
            authReq.file,
            "blogs",
            title || "blog"
        );

        const blogData = {
            title,
            content,
            image: uploadedImageUrl,
            author: authReq.user._id as any,
        };

        const newBlog = await blogService.createBlog(blogData);

        res.status(201).json({ status: "success", data: { blog: newBlog } });
    } catch (error) {
        if (uploadedImageUrl) await deleteImageFromFirebase(uploadedImageUrl);
        next(error);
    }
};

// --- EDIT ---
export const editBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authReq = req as AuthRequest;
    let uploadedImageUrl = "";

    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updates: Record<string, any> = {};

        if (title) updates.title = title;
        if (content) updates.content = content;

        if (authReq.file) {
            uploadedImageUrl = await uploadImageToFirebase(
                authReq.file,
                "blogs",
                title || "blog_updated"
            );
            updates.image = uploadedImageUrl;

        }

        const updatedBlog = await blogService.editBlog(id, updates);

        res.status(200).json({ status: "success", data: { blog: updatedBlog } });
    } catch (error) {
        if (uploadedImageUrl) await deleteImageFromFirebase(uploadedImageUrl);
        next(error);
    }
};

// --- DELETE ---
export const deleteBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const blog = await blogService.deleteBlog(id);

        if (blog && blog.image) {
            await deleteImageFromFirebase(blog.image);
        }

        res
            .status(200)
            .json({ status: "success", message: "Blog deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// --- GET ONE ---
export const getBlogController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);

        res.status(200).json({ status: "success", data: { blog } });
    } catch (error) {
        next(error);
    }
};

// --- GET ALL ---
export const getAllBlogsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogs = await blogService.getAllBlogs();

        res
            .status(200)
            .json({ status: "success", results: blogs.length, data: { blogs } });
    } catch (error) {
        next(error);
    }
};