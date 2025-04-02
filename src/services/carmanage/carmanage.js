import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListCarManage = createAsyncThunk(
  "carmanage/getListCarManage",
  async ({ currentPage, pageSize, value, customer_id }) => {
    // console.log({ currentPage, pageSize,value,customer_id })
    try {
      let apiUrl = `/customer/api/v1/motor?has_paginate&size=${pageSize}&page=${currentPage}`;
      // Kiểm tra nếu có giá trị tìm kiếm (value) và branchId
      if (value && customer_id) {
        apiUrl += `&search=${value}&customer_id=${customer_id}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (customer_id) {
        // Nếu chỉ có branchId
        apiUrl += `&customer_id=${customer_id}`;
      }

      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getDetailCarManage = createAsyncThunk(
  "carmanage/getDetailCarManage",
  async (id) => {
    try {
      let apiUrl = `/customer/api/v1/motor/${id}`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createCarManage = createAsyncThunk(
  "carmanage/createCarManage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/customer/api/v1/motor`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCarManage = createAsyncThunk(
  "carmanage/deleteCarManage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/customer/api/v1/motor/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCarManage = createAsyncThunk(
  "carmanage/editCarManage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/customer/api/v1/motor/${data.id}`,
        data
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
