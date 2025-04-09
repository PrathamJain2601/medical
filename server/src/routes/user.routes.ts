import { Router } from "express";
import user from "../controllers/user/index.controller";

const router = Router();

router.get("/get", user.getProfile);
router.put("/update", user.updateProfile);
router.delete("/delete", user.deleteProfile);

export default router;