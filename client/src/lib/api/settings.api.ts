import { apiClient } from "./client";

export type InteractionStyle = "balanced" | "concise" | "detailed";

export type Theme = "system" | "light" | "dark";

export interface Settings {
  _id: string;
  user: string;

  companionInsights: boolean;
  interactionStyle: InteractionStyle;
  memoryEnabled: boolean;
  notifications: boolean;
  theme: Theme;

  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  settings: Settings;
}

export interface UpdateSettingsResponse {
  message: string;
  settings: Settings;
}

export interface UpdateSettingsPayload {
  companionInsights?: boolean;
  interactionStyle?: InteractionStyle;
  memoryEnabled?: boolean;
  notifications?: boolean;
  theme?: Theme;
}

export async function getSettings() {
  return apiClient<SettingsResponse>("/settings", {
    method: "GET",
    auth: true,
  });
}

export async function updateSettings(payload: UpdateSettingsPayload) {
  return apiClient<UpdateSettingsResponse>("/settings", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}
