import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";
export const getListCompany = createAsyncThunk(
  "admin/branchname/getListCompany",
  async ({ currentPage, pageSize, value, company_id }) => {
    try {
      let apiUrl = `/company/api/v1/admin/companies?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (value && company_id) {
        apiUrl += `&search=${value}&branch_first_id=${company_id}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (company_id) {
        // Nếu chỉ có branchId
        apiUrl += `&branch_first_id=${company_id}`;
      }
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getAllListCompany = createAsyncThunk(
  "admin/branchname/getAllListCompany",
  async () => {
    try {
      let apiUrl = `/company/api/v1/admin/companies`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getCompanyDetail = createAsyncThunk(
  "admin/branchname/getCompanyDetail",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/admin/companies/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createCompany = createAsyncThunk(
  "admin/branchname/createCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/admin/companies`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCompany = createAsyncThunk(
  "admin/branchname/editCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/admin/companies/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCompany = createAsyncThunk(
  "admin/branchname/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/company/api/v1/admin/companies/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
