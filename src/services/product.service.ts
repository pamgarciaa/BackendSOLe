import { Filter } from "mongodb";
import Product, { IProduct } from "../models/product.model";
import fs from "fs-extra";
import AppError from "../utils/appError.util";

// CREATE PRODUCT
const createProduct = async (productData: Partial<IProduct>) => {
    return await Product.create(productData);
};

// GET ALL PRODUCTS
const getAllProducts = async (filter: Filter<IProduct> = {}) => {
    return await Product.find(filter as any);
};

// UPDATE PRODUCT
const updateProduct = async (
    id: string,
    updateData: Partial<IProduct>,
    newImageFilename?: string
) => {
    const product = await Product.findById(id);

    if (!product) throw new AppError("Product not found", 404);

    if (newImageFilename) {
        if (product.image && !product.image.startsWith("http")) {
            const oldPath = "uploads/" + product.image;
            if (await fs.pathExists(oldPath)) {
                await fs.remove(oldPath);
            }
        }
        updateData.image = newImageFilename;
    }

    Object.assign(product, updateData);
    await product.save();
    return product;
};

// DELETE PRODUCT
const deleteProduct = async (id: string) => {
    const product = await Product.findById(id);

    if (!product) throw new AppError("Product not found", 404);

    if (product.image && !product.image.startsWith("http")) {
        const imagePath = "uploads/" + product.image;
        if (await fs.pathExists(imagePath)) {
            await fs.remove(imagePath);
        }
    }

    await Product.findByIdAndDelete(id);
    return true;
};

export default { createProduct, getAllProducts, updateProduct, deleteProduct };