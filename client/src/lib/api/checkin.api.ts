import { apiClient } from "./client";

export type CheckInFeeling = "good" | "okay" | "low";
export type CheckInEnergy = "high" | "medium" | "low";
export type CheckInFocus = "product_work" | "client_work" | "learning";

export interface CheckIn {
  _id: string;
  user: string;

  feeling: CheckInFeeling;
  energy: CheckInEnergy;
  focus: CheckInFocus;

  note?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CheckInsResponse {
  checkIns: CheckIn[];
}

export interface CheckInResponse {
  checkIn: CheckIn;
  message?: string;
}

export interface CreateCheckInPayload {
  feeling: CheckInFeeling;
  energy: CheckInEnergy;
  focus: CheckInFocus;
  note?: string;
}

export async function getCheckIns() {
  return apiClient<CheckInsResponse>("/check-ins", {
    method: "GET",
    auth: true,
  });
}

export async function getTodayCheckIn() {
  return apiClient<{
    checkIn: CheckIn | null;
  }>("/check-ins/today", {
    method: "GET",
    auth: true,
  });
}

export async function createCheckIn(payload: CreateCheckInPayload) {
  return apiClient<CheckInResponse>("/check-ins", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}
