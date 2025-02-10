// src/utils/config.js

/**
 * Returns the socket URL based on the environment.
 * In development, it falls back to localhost if VITE_SOCKET_URL is not defined.
 * In production, VITE_SOCKET_URL must be defined.
 */
export function getSocketUrl() {
    if (import.meta.env.MODE === "development") {
      return import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
    }
    if (!import.meta.env.VITE_SOCKET_URL) {
      throw new Error("VITE_SOCKET_URL must be defined in production.");
    }
    return import.meta.env.VITE_SOCKET_URL;
  }
  