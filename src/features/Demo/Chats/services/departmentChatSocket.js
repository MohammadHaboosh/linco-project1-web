import { io } from "socket.io-client";
import { API_BASE_URL } from "../../../../config/apiConfig";

const getDepartmentChatUrl = () => {
  const normalizedBaseUrl = String(API_BASE_URL).replace(/\/+$/, "");
  return `${normalizedBaseUrl}/departmentChat`;
};

export const createDepartmentChatSocket = () =>
  io(getDepartmentChatUrl(), {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 750,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });
