import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";
export const getListAccountManage = createAsyncThunk(
  "admin/accountManage/getListAccountManage",
  async ({ currentPage, pageSize, value, company_id, type }) => {
    // console.log({ currentPage, pageSize,value,company_id })
    try {
      let apiUrl = `/company/api/v1/workshop/company-managers?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (value && company_id) {
        apiUrl += `&search=${value}&company_id=${company_id}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (company_id) {
        // Nếu chỉ có company_id
        apiUrl += `&company_id=${company_id}`;
      }
      if (type) {
        apiUrl += `&type=${type}`;
      }
      //   console.log(apiUrl)
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createAccountManage = createAsyncThunk(
  "admin/accountManage/createAccountManage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/company/api/v1/workshop/company-managers`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editAccountManage = createAsyncThunk(
  "admin/accountManage/editAccountManage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/workshop/company-managers/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAccountManage = createAsyncThunk(
  "admin/accountManage/deleteAccountManage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/company/api/v1/workshop/company-managers/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
