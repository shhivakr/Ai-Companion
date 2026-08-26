import mongoose, { Document, Schema, Types } from "mongoose";

export type GoalStatus = "active" | "completed" | "paused";

export interface IGoal extends Document {
  user: Types.ObjectId;

  title: string;
  description?: string;

  category?: string;

  status: GoalStatus;

  progress: number;

  milestone?: string;
  nextAction?: string;

  targetDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    milestone: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    nextAction: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    targetDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

goalSchema.index({
  user: 1,
  status: 1,
  createdAt: -1,
});

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
