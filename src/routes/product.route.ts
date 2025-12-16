import { Router } from "express";
import {
    createProductController,
    getProductByIdController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
} from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createUploadMiddleware } from "../middlewares/multer.middleware";

const router = Router();
const upload = createUploadMiddleware("products");

router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);

router.post(
    "/",
    protect,
    checkRole("admin", "moderator"),
    upload.single("image"),
    createProductController
);

router.patch(
    "/:id",
    protect,
    checkRole("admin", "moderator"),
    upload.single("image"),
    updateProductController
);

router.delete(
    "/:id",
    protect,
    checkRole("admin", "moderator"),
    deleteProductController
);

export default router;