import mongoose, { Document, Schema, Types } from "mongoose";

export type CheckInFeeling = "good" | "okay" | "low";
export type CheckInEnergy = "high" | "medium" | "low";
export type CheckInFocus = "product_work" | "client_work" | "learning";
export interface ICheckIn extends Document {
  user: Types.ObjectId;
  feeling: CheckInFeeling;
  energy: CheckInEnergy;
  focus: CheckInFocus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const checkInSchema = new Schema<ICheckIn>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    feeling: {
      type: String,
      enum: ["good", "okay", "low"],
      required: true,
      index: true,
    },

    energy: {
      type: String,
      enum: ["high", "medium", "low"],
      required: true,
      index: true,
    },

    focus: {
      type: String,
      enum: ["product_work", "client_work", "learning"],
      required: true,
      index: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

checkInSchema.index({
  user: 1,
  createdAt: -1,
});

export const CheckIn = mongoose.model<ICheckIn>("CheckIn", checkInSchema);
