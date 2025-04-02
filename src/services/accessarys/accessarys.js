import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListAccessarys = createAsyncThunk(
  "accessarys/getListAccessarys",
  async ({ currentPage, pageSize, type, search }) => {
    try {
      let apiUrl = `/company/api/v1/accessary?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (search && type) {
        apiUrl += `&search=${search}&type=${type}`;
      } else if (search) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${search}`;
      } else if (type) {
        // Nếu chỉ có branchId
        apiUrl += `&type=${type}`;
      }
      // console.log(apiUrl)
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getAllListAccessarys = createAsyncThunk(
  "accessarys/getAllListAccessarys",
  async () => {
    try {
      let apiUrl = `/company/api/v1/accessary`;

      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getDetailAccessarys = createAsyncThunk(
  "accessarys/getDetailAccessarys",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/accessary/${id}`;

      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createAccessarys = createAsyncThunk(
  "accessarys/createAccessarys",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/accessary`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editAccessarys = createAsyncThunk(
  "accessarys/editAccessarys",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/accessary/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAccessarys = createAsyncThunk(
  "accessarys/deleteAccessarys",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/accessary/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const exportExcelAccessarys = createAsyncThunk(
  "accessarys/exportExcelAccessarys",
  async () => {
    try {
      let apiUrl = `/company/api/v1/accessary-export`;
      const response = await http.get(apiUrl);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
