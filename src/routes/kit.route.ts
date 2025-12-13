import { Router } from "express";
import { getAllKitsController } from "../controllers/product.controller";

const router = Router();

router.get("/", getAllKitsController);

export default router;