import { Router } from "express";
import { getAllKitsController } from "../controllers/product.controller";
import { 
    requestKitInfoController, 
    getAllKitRequestsController 
} from "../controllers/kitrequest.controller";
import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/", getAllKitsController);

router.post("/request-info", requestKitInfoController);

// VER LAS SOLICITUDES DE CONTACTO - SOLO ADMINS Y MODERATORS
router.get(
    "/requests", 
    protect, 
    checkRole("admin", "moderator"), 
    getAllKitRequestsController
);

export default router;