"use client";

import axios from "axios";

const API_URL = "http://localhost:8026/api";

const dashboardService = {
  getDashboardSummary: async (token, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategoriesSummary: async (token, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTransactions: async (token, filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
