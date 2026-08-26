import mongoose, { Document, Schema, Types } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "completed";

export interface ITask extends Document {
  user: Types.ObjectId;
  goal?: Types.ObjectId;

  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate?: Date;
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
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

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true,
    },

    dueDate: {
      type: Date,
      index: true,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({
  user: 1,
  status: 1,
  dueDate: 1,
});

taskSchema.index({
  user: 1,
  createdAt: -1,
});

export const Task = mongoose.model<ITask>("Task", taskSchema);
