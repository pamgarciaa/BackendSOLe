import { Router } from "express";
import {
    getMyOrdersController,
    getAllOrdersController,
} from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/myorders", protect, getMyOrdersController);

router.get("/all", protect, checkRole("admin"), getAllOrdersController);

export default router;