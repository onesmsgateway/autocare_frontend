import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListJobCateGory = createAsyncThunk(
  "jobCateGory/getListJobCateGory",
  async ({ currentPage, pageSize, value, branchId }) => {
    try {
      let apiUrl = `/company/api/v1/job-category?has_paginate&size=${pageSize}&page=${currentPage}`;
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
export const getAllListJobCateGory = createAsyncThunk(
  "jobCateGory/getAllListJobCateGory",
  async () => {
    try {
      let apiUrl = `/company/api/v1/job-category`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getDetailJobCateGory = createAsyncThunk(
  "jobCateGory/getDetailJobCateGory",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/job-category/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createJobCateGory = createAsyncThunk(
  "jobCateGory/createJobCateGory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/job-category`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editJobCateGory = createAsyncThunk(
  "jobCateGory/editJobCateGory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/job-category/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteJobCateGory = createAsyncThunk(
  "jobCateGory/deleteJobCateGory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/job-category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
