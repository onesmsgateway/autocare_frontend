import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListDepartments = createAsyncThunk(
  "department/getListDepartments",
  async ({ currentPage, pageSize, search, branchId }) => {
    try {
      let apiUrl = `/company/api/v1/departments?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (search && branchId) {
        apiUrl += `&search=${search}&branch_first_id=${branchId}`;
      } else if (search) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${search}`;
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
export const getAllListDepartments = createAsyncThunk(
  "department/getAllListDepartments",
  async () => {
    try {
      let apiUrl = `/company/api/v1/departments`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/departments`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/departments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editDepartment = createAsyncThunk(
  "department/editDepartment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/departments/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
