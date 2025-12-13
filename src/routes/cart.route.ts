import { Router } from "express";
import {
    addToCartController,
    getCartController,
    checkoutController,
    deleteItemFromCartController,
} from "../controllers/cart.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", protect, addToCartController);
router.get("/", protect, getCartController);
router.post("/checkout", protect, checkoutController);
router.delete("/:productId", protect, deleteItemFromCartController);

export default router;