import mongoose, { Document, Schema, Types } from "mongoose";

export type NotificationType =
  | "task"
  | "goal"
  | "check_in"
  | "companion"
  | "reminder"
  | "system";

export interface INotification extends Document {
  user: Types.ObjectId;

  type: NotificationType;

  title: string;
  description?: string;

  read: boolean;

  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;  
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["task", "goal", "check_in", "companion", "reminder", "system"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  user: 1,
  read: 1,
  createdAt: -1,
});

notificationSchema.index({
  user: 1,
  createdAt: -1,
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
