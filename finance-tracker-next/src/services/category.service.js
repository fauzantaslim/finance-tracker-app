"use client";

import axios from "axios";

const API_URL = "http://localhost:8026/api";

const categoryService = {
  getCategories: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/categories`, {
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

  getCategory: async (token, categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (token, categoryData) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (token, categoryId, categoryData) => {
    try {
      const response = await axios.put(
        `${API_URL}/categories/${categoryId}`,
        categoryData,
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

  deleteCategory: async (token, categoryId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/categories/${categoryId}`,
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
};

export default categoryService;
