import axios from "axios";
import { API_BASE_URL } from "./auth.service";

export async function getDashboard(token, params = {}) {
  const response = await axios.get(`${API_BASE_URL}/dashboard`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
  return response.data?.data;
}

export async function getDashboardCategories(token, params = {}) {
  const response = await axios.get(`${API_BASE_URL}/dashboard/categories`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
  return response.data?.data?.categories ?? [];
}

export async function getDashboardTransactions(token, params = {}) {
  const response = await axios.get(`${API_BASE_URL}/dashboard/transactions`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
  return response.data?.data ?? { transactions: [], pagination: null };
}
