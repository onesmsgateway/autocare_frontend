import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListStaff = createAsyncThunk(
  "staff/getListStaff",
  async ({ currentPage, pageSize, value, branchId }) => {
    // console.log({ currentPage, pageSize,value,branchId })
    try {
      let apiUrl = `/company/api/v1/employee-management?has_paginate&size=${pageSize}&page=${currentPage}`;
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
export const getAllListStaff = createAsyncThunk(
  "staff/getAllListStaff",
  async () => {
    // console.log({ currentPage, pageSize,value,branchId })
    try {
      let apiUrl = `/company/api/v1/employee-management`;

      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/createStaff",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/company/api/v1/employee-management`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editStaff = createAsyncThunk(
  "staff/editStaff",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/employee-management/${data.id}`,
        data
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/company/api/v1/employee-management/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
