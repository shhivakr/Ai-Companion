import type { Request, Response } from "express";
import mongoose from "mongoose";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../services/notification.service.js";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

export async function getNotificationsController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const notifications = await getNotifications(userId);

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
}

export async function getUnreadCountController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const count = await getUnreadCount(userId);

    return res.status(200).json({
      count,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);

    return res.status(500).json({
      message: "Failed to fetch unread notification count",
    });
  }
}

export async function markNotificationAsReadController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid notification ID",
    });
  }

  try {
    const userId = getUserId(req);

    const notification = await markAsRead(userId, id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      message: "Failed to mark notification as read",
    });
  }
}

export async function markAllNotificationsAsReadController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

    const result = await markAllAsRead(userId);

    return res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      message: "Failed to mark all notifications as read",
    });
  }
}
