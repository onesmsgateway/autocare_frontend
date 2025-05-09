import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListStores = createAsyncThunk(
  "stores/getListStores",
  async ({ currentPage, pageSize, value, branchId }) => {
    try {
      let apiUrl = `/company/api/v1/store?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (value && branchId) {
        apiUrl += `&search=${value}&branch_first_id=${branchId}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (branchId) {
        // Nếu chỉ có branchId
        apiUrl += `&branch_first_id=${branchId}`;
      }

      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getAllListStores = createAsyncThunk(
  "stores/getAllListStores",
  async () => {
    try {
      let apiUrl = `/company/api/v1/store`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createStores = createAsyncThunk(
  "stores/createStores",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/store`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editStores = createAsyncThunk(
  "stores/editStores",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(`/company/api/v1/store/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteStores = createAsyncThunk(
  "stores/deleteStores",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/store/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
