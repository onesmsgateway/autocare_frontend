import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";

export const getListCompanyBranch = createAsyncThunk(
  "admin/companyBranch/getListCompanyBranch",
  async ({ currentPage, pageSize, value, company_id }) => {
    try {
      let apiUrl = `/company/api/v1/workshop/companies?has_paginate&child=${true}&size=${pageSize}&page=${currentPage}`;
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
export const getAllListCompanyBranch = createAsyncThunk(
  "admin/companyBranch/getAllListCompanyBranch",
  async () => {
    try {
      let apiUrl = `/company/api/v1/workshop/companies?child=${true}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getAllListCompanyBranchNoManager = createAsyncThunk(
  "admin/companyBranch/getAllListCompanyBranchNoManager",
  async () => {
    try {
      let apiUrl = `/company/api/v1/workshop/companies?child=${true}&no_manager=${true}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getCompanyBranchDetail = createAsyncThunk(
  "admin/companyBranch/getCompanyBranchDetail",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/workshop/companies/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createCompanyBranch = createAsyncThunk(
  "admin/companyBranch/createCompanyBranch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/company/api/v1/workshop/companies`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCompanyBranch = createAsyncThunk(
  "admin/companyBranch/editCompanyBranch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/workshop/companies/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCompanyBranch = createAsyncThunk(
  "admin/companyBranch/deleteCompanyBranch",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/company/api/v1/workshop/companies/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
