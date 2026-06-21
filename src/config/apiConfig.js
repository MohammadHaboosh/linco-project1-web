export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  SIGN_UP: `${API_BASE_URL}/authentication/sign-up`,
  LOGIN: `${API_BASE_URL}/authentication/login`,
};