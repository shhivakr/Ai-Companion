import mongoose from "mongoose";

import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";

import { aiProvider } from "./ai.service";
import { getCompanionContext } from "./context.service";

import { buildCompanionSystemPrompt } from "../prompts/companion.prompt";

interface ChatResult {
  conversationId: string;
  message: string;
}

export async function chatWithCompanion(
  userId: string,
  message: string,
  conversationId?: string,
): Promise<ChatResult> {
  let conversation: InstanceType<typeof Conversation> | null = null;

  if (conversationId) {
    if (!mongoose.isValidObjectId(conversationId)) {
      throw new Error("Invalid conversation ID");
    }

    conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      user: userId,
      title: message.slice(0, 120),
    });
  }

  await Message.create({
    conversation: conversation._id,
    user: userId,
    role: "user",
    content: message,
  });

  const [context, history] = await Promise.all([
    getCompanionContext(userId),

    Message.find({
      conversation: conversation._id,
      user: userId,
    })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean(),
  ]);

  const systemInstruction = buildCompanionSystemPrompt(context);

  const messages = history.map((item) => ({
    role: item.role,
    content: item.content,
  }));

  const response = await aiProvider.generateResponse({
    systemInstruction,
    messages,
  });

  await Message.create({
    conversation: conversation._id,
    user: userId,
    role: "assistant",
    content: response.content,
  });

  await Conversation.updateOne(
    {
      _id: conversation._id,
      user: userId,
    },
    {
      $set: {
        updatedAt: new Date(),
      },
    },
  );

  return {
    conversationId: conversation._id.toString(),
    message: response.content,
  };
}

export async function getConversationHistory(
  userId: string,
  conversationId: string,
) {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
  }).lean();

  if (!conversation) {
    return null;
  }

  const messages = await Message.find({
    conversation: conversation._id,
    user: userId,
  })
    .sort({ createdAt: 1 })
    .lean();

  return {
    conversationId: conversation._id.toString(),
    title: conversation.title,
    messages: messages.map((message) => ({
      id: message._id.toString(),
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    })),
  };
}
