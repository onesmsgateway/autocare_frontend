import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListSupplier = createAsyncThunk(
  "supplier/getListSupplier",
  async ({ currentPage, pageSize, value, branchId }) => {
    // console.log({ currentPage, pageSize,value,branchId })
    try {
      let apiUrl = `/supplier/api/v1/suppliers?has_paginate&size=${pageSize}&page=${currentPage}`;
      // Kiểm tra nếu có giá trị tìm kiếm (value) và branchId
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
export const getAllListSupplier = createAsyncThunk(
  "supplier/getAllListSupplier",
  async () => {
    // console.log({ currentPage, pageSize,value,branchId })
    try {
      let apiUrl = `/supplier/api/v1/suppliers`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/supplier/api/v1/suppliers`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/supplier/api/v1/suppliers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editSupplier = createAsyncThunk(
  "supplier/editSupplier",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/supplier/api/v1/suppliers/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
