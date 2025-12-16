import Blog, { IBlog } from "../models/blog.model";
import AppError from "../utils/appError.util";
import { deleteImageFromFirebase } from "@/utils/firebaseStorage.util";

// CREATE
const createBlog = async (blogData: Partial<IBlog>) => {
    return await Blog.create(blogData);
};

// EDIT
const editBlog = async (id: string, updates: Partial<IBlog>) => {
    const currentBlog = await Blog.findById(id);
    if (!currentBlog) throw new AppError("Blog not found", 404);

    if (updates.image && currentBlog.image && currentBlog.image.startsWith("http")) {
        await deleteImageFromFirebase(currentBlog.image);
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, {
        new: true,
    }).populate("author", "name username profilePicture");

    return blog;
};

// GET BY ID
const getBlogById = async (id: string) => {
    const blog = await Blog.findById(id).populate(
        "author",
        "name username profilePicture"
    );
    return AppError.try(blog, "Blog not found", 404);
};

// DELETE
const deleteBlog = async (id: string) => {
    const blog = await Blog.findById(id);
    if (!blog) throw new AppError("Blog not found", 404);

    if (blog.image && blog.image.startsWith("http")) {
        await deleteImageFromFirebase(blog.image);
    }

    await Blog.findByIdAndDelete(id);
    return blog;
};

// GET ALL
const getAllBlogs = async () => {
    return await Blog.find().populate("author", "name username profilePicture");
};

export default { createBlog, editBlog, deleteBlog, getBlogById, getAllBlogs };