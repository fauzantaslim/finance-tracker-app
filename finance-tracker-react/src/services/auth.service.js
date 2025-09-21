import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API base URL from Swagger servers
export const API_BASE_URL = "http://localhost:8026/api";

async function authLogin(data, callback) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
      withCredentials: true,
    });
    callback(true, response);
  } catch (error) {
    callback(false, error);
  }
}

export default authLogin;

export const getUsername = (token) => {
  const decoded = jwtDecode(token);
  return decoded.user ?? "";
};

export const getUserInfo = (token) => {
  const decoded = jwtDecode(token);
  return {
    name: decoded.full_name || decoded.user || "User",
    email: decoded.email || "user@example.com",
  };
};

export async function logoutUser(token) {
  await axios.post(
    `${API_BASE_URL}/auth/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );
}

export async function refreshAccessToken() {
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  // response.data.data.tokens.access_token
  return response.data?.data?.tokens?.access_token;
}
