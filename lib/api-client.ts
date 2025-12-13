import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  const token = match?.[2];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
