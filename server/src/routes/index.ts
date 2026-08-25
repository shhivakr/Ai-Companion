import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Personal AI Companion API is running",
  });
});

router.use("/auth", authRoutes);

export default router;
