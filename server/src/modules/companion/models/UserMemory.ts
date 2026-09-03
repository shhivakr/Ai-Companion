import mongoose, { Schema, Document } from "mongoose";

export interface IUserMemory extends Document {
  user: mongoose.Types.ObjectId;
  category:
    | "preference"
    | "routine"
    | "work_style"
    | "personal_context"
    | "productivity";
  key: string;
  value: string;
  source: "user_explicit" | "user_confirmed";
  confidence: "high" | "medium";
  createdAt: Date;
  updatedAt: Date;
}

const UserMemorySchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "preference",
        "routine",
        "work_style",
        "personal_context",
        "productivity",
      ],
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["user_explicit", "user_confirmed"],
      required: true,
    },
    confidence: {
      type: String,
      enum: ["high", "medium"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserMemorySchema.index({ user: 1, category: 1, key: 1 }, { unique: true });

export const UserMemory = mongoose.model<IUserMemory>(
  "UserMemory",
  UserMemorySchema,
);
