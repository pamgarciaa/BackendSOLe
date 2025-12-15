import { Router } from "express";
import {
    getAllKitsController,
    createKitController,
    updateKitController,
    deleteKitController,
    getKitByIdController
} from "../controllers/kit.controller";
import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createUploadMiddleware } from "../middlewares/multer.middleware";

const router = Router();
const upload = createUploadMiddleware("kits");

router.get("/", getAllKitsController);
router.get("/:id", getKitByIdController);

router.post(
    "/",
    protect,
    checkRole("admin", "moderator"),
    upload.single("kitImage"),
    createKitController
);

router.patch(
    "/:id",
    protect,
    checkRole("admin", "moderator"),
    upload.single("kitImage"),
    updateKitController
);

router.delete(
    "/:id",
    protect,
    checkRole("admin", "moderator"),
    deleteKitController
);

export default router;