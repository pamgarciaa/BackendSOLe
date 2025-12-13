import { Request, Response, NextFunction } from "express";
import fs from "fs-extra";
import blogService from "@/services/blog.service";
import AppError from "@/utils/appError.util";
import { Types } from "mongoose";

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

    try {
        const { title, content } = req.body;

        if (!authReq.file) {
            return next(new AppError("Please upload an image", 400));
        }

        if (!authReq.user) {
            return next(new AppError("Usuario no autenticado", 401));
        }

        const blogData = {
            title,
            content,
            image: authReq.file.path,
            author: authReq.user._id as any,
        };

        const newBlog = await blogService.createBlog(blogData);

        res.status(201).json({ status: "success", data: { blog: newBlog } });
    } catch (error) {
        if (authReq.file) await fs.remove(authReq.file.path);
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

    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updates: Record<string, any> = {};

        if (title) updates.title = title;
        if (content) updates.content = content;

        if (authReq.file) {
            updates.image = authReq.file.path;
        }

        const updatedBlog = await blogService.editBlog(id, updates);

        res.status(200).json({ status: "success", data: { blog: updatedBlog } });
    } catch (error) {
        if (authReq.file) await fs.remove(authReq.file.path);
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
            await fs.remove(blog.image);
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