import { Router } from "express";
import {
    registerController,
    loginController,
    logoutController,
    getAllUsersController,
    removeUserController,
    getUserController,
    forgotPasswordController,
    resetPasswordController,
    updateUserController,
    updatePasswordController,
} from "../controllers/auth.controller";

import { protect } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createUploadMiddleware } from "../middlewares/multer.middleware";

const router = Router();
const upload = createUploadMiddleware("users");

router.post("/register", upload.single("image"), registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.patch(
    "/update",
    protect,
    upload.single("profilePicture"),
    updateUserController
);

router.get("/all", protect, checkRole("admin"), getAllUsersController);
router.get("/:id", protect, checkRole("admin"), getUserController);
router.delete("/:id", protect, checkRole("admin"), removeUserController);

router.put("/updatepassword", protect, updatePasswordController);
router.post("/forgotpassword", forgotPasswordController);
router.post("/resetpassword", resetPasswordController);

export default router;