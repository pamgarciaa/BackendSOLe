import { Router } from "express";
import {
    requestKitInfoController,
    getAllKitRequestsController
} from "../controllers/kitrequest.controller";
import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";

const router = Router();


router.post("/request-info", requestKitInfoController);

router.get(
    "/requests",
    protect,
    checkRole("admin", "moderator"),
    getAllKitRequestsController
);

export default router;