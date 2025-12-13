import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBlog extends Document {
    title: string;
    content: string;
    image: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;