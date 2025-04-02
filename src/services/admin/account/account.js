import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";
export const getListAccount = createAsyncThunk(
  "admin/account/getListAccount",
  async ({ currentPage, pageSize, value, company_id, type }) => {
    // console.log({ currentPage, pageSize,value,company_id })
    try {
      let apiUrl = `/auth/api/v1/get-list?has_paginate&size=${pageSize}&page=${currentPage}`;
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
export const createAccount = createAsyncThunk(
  "admin/account/createAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/auth/api/v1/register`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editAccount = createAsyncThunk(
  "admin/account/editAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(`/auth/api/v1/user/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAccount = createAsyncThunk(
  "admin/account/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/auth/api/v1/user/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
