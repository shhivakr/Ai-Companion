import { apiClient, setAccessToken } from "./client";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user?: User;
    accessToken?: string;
    userId?: string;
    id?: string;
    _id?: string;
  };
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken);
  }

  return response;
}

export async function getCurrentUser() {
  return apiClient<AuthResponse>("/auth/me", {
    method: "GET",
    auth: true,
  });
}

export async function refreshAccessToken() {
  const response = await apiClient<AuthResponse>("/auth/refresh", {
    method: "POST",
  });

  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken);
  }

  return response;
}

export async function logoutUser() {
  const response = await apiClient<AuthResponse>("/auth/logout", {
    method: "POST",
  });

  setAccessToken(null);

  return response;
}
