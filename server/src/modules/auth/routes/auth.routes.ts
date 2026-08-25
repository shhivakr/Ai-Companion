import { Router } from "express";

import {
  getMe,
  login,
  logout,
  refresh,
  register,
} from "../controllers/auth.controller.js";

import { requireAuth } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", requireAuth, getMe);

export default router;
