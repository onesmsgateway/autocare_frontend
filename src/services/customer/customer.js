import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListCustomer = createAsyncThunk(
  "customer/getListCustomer",
  async ({ currentPage, pageSize, group_id, search }) => {
    console.log({ currentPage, pageSize, group_id, search });
    try {
      let apiUrl = `/customer/api/v1/customers?has_paginate&size=${pageSize}&page=${currentPage}&dir=DESC`;
      if (search && group_id) {
        apiUrl += `&search=${search}&group_id=${group_id}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (group_id) {
        apiUrl += `&group_id=${group_id}`;
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
export const getAllListCustomer = createAsyncThunk(
  "customer/getAllListCustomer",
  async () => {
    try {
      let apiUrl = `/customer/api/v1/customers`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getDetailCustomer = createAsyncThunk(
  "customer/getDetailCustomer",
  async (id) => {
    try {
      let apiUrl = `/customer/api/v1/customers/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/customer/api/v1/customers`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/customer/api/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editCustomer = createAsyncThunk(
  "customer/editCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/customer/api/v1/customers/${data.id}`,
        data
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const exportExcelCustomer = createAsyncThunk(
  "customer/exportExcelCustomer",
  async () => {
    try {
      let apiUrl = `/customer/api/v1/customer-export`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
