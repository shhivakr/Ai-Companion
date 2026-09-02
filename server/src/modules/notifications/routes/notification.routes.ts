import { Router } from "express";

import { requireAuth } from "../../../middleware/auth.middleware.js";

import {
  getNotificationsController,
  getUnreadCountController,
  markAllNotificationsAsReadController,
  markNotificationAsReadController,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getNotificationsController);
router.get("/unread-count", getUnreadCountController);
router.patch("/read-all", markAllNotificationsAsReadController);
router.patch("/:id/read", markNotificationAsReadController);

export default router;
