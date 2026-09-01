import { Types } from "mongoose";

import { Settings } from "../models/Settings";
import type { UpdateSettingsInput } from "../validation/settings.validation";

const DEFAULT_SETTINGS = {
  companionInsights: true,
  interactionStyle: "balanced" as const,
  memoryEnabled: true,
  notifications: true,
  theme: "system" as const,
};

export async function getSettings(userId: string) {
  return Settings.findOneAndUpdate(
    {
      user: new Types.ObjectId(userId),
    },
    {
      $setOnInsert: {
        user: new Types.ObjectId(userId),
        ...DEFAULT_SETTINGS,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
}

export async function updateSettings(
  userId: string,
  data: UpdateSettingsInput,
) {
  return Settings.findOneAndUpdate(
    {
      user: new Types.ObjectId(userId),
    },
    {
      $set: data,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );
}
