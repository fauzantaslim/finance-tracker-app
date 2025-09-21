"use client";

import axios from "axios";

const API_URL = "http://localhost:8026/api";

const accountService = {
  getAccounts: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAccount: async (token, accountId) => {
    try {
      const response = await axios.get(`${API_URL}/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAccount: async (token, accountData) => {
    try {
      const response = await axios.post(`${API_URL}/accounts`, accountData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAccount: async (token, accountId, accountData) => {
    try {
      const response = await axios.put(
        `${API_URL}/accounts/${accountId}`,
        accountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAccount: async (token, accountId) => {
    try {
      const response = await axios.delete(`${API_URL}/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default accountService;
