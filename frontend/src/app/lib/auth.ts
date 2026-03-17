import { apiRequest } from "./api";

export type UserRole = "student" | "teacher" | "staff" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  lastLoginAt?: string | null;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string | null;
    gender?: string | null;
    birthday?: string | null;
    profileImage?: string | null;
  } | null;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

const AUTH_STORAGE_KEY = "eway-auth";

export async function registerStudent(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}) {
  const response = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });

  persistAuth(response);
  return response;
}

export async function verifyEmail(payload: { token: string }) {
  return apiRequest<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export async function login(payload: { email: string; password: string }) {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });

  persistAuth(response);
  return response;
}

export async function sendResetCode(payload: { email: string }) {
  return apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export async function verifyResetCode(payload: { email: string; code: string }) {
  return apiRequest<{ message: string }>("/auth/verify-reset-code", {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload: {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}) {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export async function verifySetupToken(payload: { email: string; token: string }) {
  return apiRequest<{ message: string }>("/auth/verify-setup-token", {
    method: "POST",
    body: payload,
  });
}

export async function setupPassword(payload: {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}) {
  return apiRequest<{ message: string }>("/auth/setup-password", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentUser(token: string) {
  return apiRequest<{ user: AuthUser }>("/auth/me", {
    method: "GET",
    token,
  });
}

export function persistAuth(auth: AuthResponse) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function getStoredAuth(): AuthResponse | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
