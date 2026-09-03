import mongoose, { Document, Schema, Types } from "mongoose";

export type MessageRole = "user" | "assistant";

export interface IMessage extends Document {
  conversation: Types.ObjectId;

  user: Types.ObjectId;

  role: MessageRole;

  content: string;

  /**
   * Client-generated idempotency key.
   * Used to prevent duplicate user message persistence on retry.
   * Only present on user messages. Optional for backward compatibility.
   */
  clientMessageId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 10000,
    },

    clientMessageId: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

messageSchema.index({
  user: 1,
  createdAt: -1,
});

// Unique index so the same clientMessageId cannot be inserted twice
// for the same conversation. Sparse so messages without clientMessageId
// are not affected.
messageSchema.index(
  { conversation: 1, clientMessageId: 1 },
  { unique: true, sparse: true },
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
