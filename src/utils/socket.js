import { io } from "socket.io-client";

// Use environment variable or fallback to localhost for development
const socket = io(process.env.VITE_SOCKET_URL || "http://localhost:3001");

// Join notifications room
export const joinNotifications = (userId) => {
  if (socket && userId) {
    socket.emit("join", userId);
  }
};

// Listen for new notifications
export const listenForNotifications = (callback) => {
  if (socket) {
    socket.on("new_notification", (notification) => {
      callback(notification);
    });
  }
};

// Disconnect the socket connection
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export default socket;
