import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListGroupCustomer = createAsyncThunk(
  "groupCustomer/getListGroupCustomer",
  async ({ currentPage, pageSize, value, branchId }) => {
    try {
      let apiUrl = `/customer/api/v1/group-customers?has_paginate&size=${pageSize}&page=${currentPage}`;
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
export const getAllListGroupCustomer = createAsyncThunk(
  "groupCustomer/getAllListGroupCustomer",
  async () => {
    try {
      let apiUrl = `/customer/api/v1/group-customers`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createGroupCustomer = createAsyncThunk(
  "groupCustomer/createGroupCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/customer/api/v1/group-customers`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteGroupCustomer = createAsyncThunk(
  "groupCustomer/deleteGroupCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/customer/api/v1/group-customers/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editGroupCustomer = createAsyncThunk(
  "groupCustomer/editGroupCustomer",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/customer/api/v1/group-customers/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
