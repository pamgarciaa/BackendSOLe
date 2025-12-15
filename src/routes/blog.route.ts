import { Router } from "express";
import {
    createBlogController,
    editBlogController,
    deleteBlogController,
    getBlogController,
    getAllBlogsController,
} from "../controllers/blog.controller";
import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createUploadMiddleware } from "../middlewares/multer.middleware";

const router = Router();
const upload = createUploadMiddleware("blogs");

router.get("/", getAllBlogsController);
router.get("/:id", getBlogController);

router.post(
    "/",
    protect,
    checkRole("admin", "moderator"),
    upload.single("image"),
    createBlogController
);

router.patch(
    "/:id",
    protect,
    checkRole("admin", "moderator"),
    upload.single("image"),
    editBlogController
);

router.delete(
    "/:id",
    protect,
    checkRole("admin", "moderator"),
    deleteBlogController
);

export default router;