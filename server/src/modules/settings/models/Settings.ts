import mongoose, { Document, Schema, Types } from "mongoose";

export type InteractionStyle = "balanced" | "concise" | "detailed";

export type Theme = "system" | "light" | "dark";

export interface ISettings extends Document {
  user: Types.ObjectId;

  companionInsights: boolean;
  interactionStyle: InteractionStyle;

  memoryEnabled: boolean;

  notifications: boolean;

  theme: Theme;

  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    companionInsights: {
      type: Boolean,
      default: true,
    },

    interactionStyle: {
      type: String,
      enum: ["balanced", "concise", "detailed"],
      default: "balanced",
    },

    memoryEnabled: {
      type: Boolean,
      default: true,
    },

    notifications: {
      type: Boolean,
      default: true,
    },

    theme: {
      type: String,
      enum: ["system", "light", "dark"],
      default: "system",
    },
  },
  {
    timestamps: true,
  },
);

export const Settings = mongoose.model<ISettings>("Settings", settingsSchema);
