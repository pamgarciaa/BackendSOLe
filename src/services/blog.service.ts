import Blog, { IBlog } from "../models/blog.model";
import AppError from "../utils/appError.util";

// CREATE
const createBlog = async (blogData: Partial<IBlog>) => {
    return await Blog.create(blogData);
};

// EDIT
const editBlog = async (id: string, updates: Partial<IBlog>) => {
    const blog = await Blog.findByIdAndUpdate(id, updates, {
        new: true,
    }).populate("author", "name username profilePicture");

    return AppError.try(blog, "Blog not found", 404);
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
    const blog = await Blog.findByIdAndDelete(id);
    return AppError.try(blog, "Blog not found", 404);
};

// GET ALL
const getAllBlogs = async () => {
    return await Blog.find().populate("author", "name username profilePicture");
};

export default { createBlog, editBlog, deleteBlog, getBlogById, getAllBlogs };