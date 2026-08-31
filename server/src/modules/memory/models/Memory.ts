import mongoose, { Document, Model, Schema } from "mongoose";

export type MemoryCategory =
  | "working_style"
  | "project"
  | "focus"
  | "preference";

export type MemorySource =
  | "conversation"
  | "checkin"
  | "goal"
  | "task"
  | "manual";

export interface IMemory extends Document {
  user: mongoose.Types.ObjectId;

  title: string;
  content: string;

  category: MemoryCategory;
  source: MemorySource;

  importance: number;

  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
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
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: ["working_style", "project", "focus", "preference"],
      required: true,
    },

    source: {
      type: String,
      enum: ["conversation", "checkin", "goal", "task", "manual"],
      required: true,
    },

    importance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
  },
  {
    timestamps: true,
  },
);

memorySchema.index({
  user: 1,
  createdAt: -1,
});

memorySchema.index({
  user: 1,
  category: 1,
});

export const Memory: Model<IMemory> =
  mongoose.models.Memory || mongoose.model<IMemory>("Memory", memorySchema);
