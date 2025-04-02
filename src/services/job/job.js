import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListJob = createAsyncThunk(
  "job/getListJob",
  async ({ currentPage, pageSize, value, branchId }) => {
    try {
      let apiUrl = `/company/api/v1/jobs?has_paginate&size=${pageSize}&page=${currentPage}`;
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
export const getDetailJob = createAsyncThunk("job/getDetailJob", async (id) => {
  try {
    let apiUrl = `/company/api/v1/jobs/${id}`;
    const response = await http.get(apiUrl);
    // console.log(response)
    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});

export const createJob = createAsyncThunk(
  "job/createJob",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/jobs`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editJob = createAsyncThunk(
  "job/editJob",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(`/company/api/v1/jobs/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/jobs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
