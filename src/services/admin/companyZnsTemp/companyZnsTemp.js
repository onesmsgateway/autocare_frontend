import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";

export const getListCompanyZnsTemp = createAsyncThunk(
  "admin/companyZnsTemp/getListCompanyZnsTemp",
  async ({ currentPage, pageSize, value }) => {
    try {
      let apiUrl = `/company/api/v1/admin/zns-temps?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      }
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getAllListCompanyZnsTemp = createAsyncThunk(
  "admin/companyZnsTemp/getAllListCompanyBranch",
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
export const getCompanyZnsTempDetail = createAsyncThunk(
  "admin/companyZnsTemp/getCompanyZnsTempDetail",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/admin/zns-temps/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createCompanyZnsTemp = createAsyncThunk(
  "admin/companyZnsTemp/createCompanyZnsTemp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/company/api/v1/admin/zns-temps`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCompanyZnsTemp = createAsyncThunk(
  "admin/CompanyZnsTemp/editCompanyZnsTemp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/admin/zns-temps/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCompanyZnsTemp = createAsyncThunk(
  "admin/companyZnsTemp/deleteCompanyZnsTemp",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/company/api/v1/admin/zns-temps/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
