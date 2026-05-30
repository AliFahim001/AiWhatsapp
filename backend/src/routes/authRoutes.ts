import { Router } from "express";
import { authCallBack, getMe } from "../controllers/authController";
import { protectRoute } from "../middleware/auth";

const authRoutes = Router();

authRoutes.get("/me", protectRoute, getMe);
authRoutes.post("/callback", authCallBack);

export default authRoutes;
