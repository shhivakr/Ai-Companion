import { Types } from "mongoose";

import { Notification, NotificationType } from "../models/Notification";

interface CreateNotificationData {
  type: NotificationType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}


export async function createNotification(
  userId: string,
  data: CreateNotificationData,
) {
  return Notification.create({
    user: new Types.ObjectId(userId),
    type: data.type,
    title: data.title,
    description: data.description,
    read: false,
    metadata: data.metadata,
  });
}

export async function getNotifications(userId: string) {
  return Notification.find({
    user: new Types.ObjectId(userId),
  }).sort({
    createdAt: -1,
  });
}

export async function getUnreadCount(userId: string) {
  return Notification.countDocuments({
    user: new Types.ObjectId(userId),
    read: false,
  });
}

export async function markAsRead(userId: string, notificationId: string) {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: new Types.ObjectId(userId),
    },
    {
      read: true,
    },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function markAllAsRead(userId: string) {
  return Notification.updateMany(
    {
      user: new Types.ObjectId(userId),
      read: false,
    },
    {
      read: true,
    },
  );
}
