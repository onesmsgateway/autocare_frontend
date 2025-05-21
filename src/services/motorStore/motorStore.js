import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListMotorStore = createAsyncThunk(
  "motorStore/getListMotorStore",
  async ({ currentPage, pageSize, search }) => {
    try {
      let apiUrl = `/company/api/v1/motor-store?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (search) {
        apiUrl += `&search=${search}`;
      } 
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);


export const getMotorStore = createAsyncThunk(
  "motorStore/getMotorStore",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/motor-store/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createMotorStore = createAsyncThunk(
  "motorStore/createMotorStore",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/motor-store`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const editMotorStore = createAsyncThunk(
  "motorStore/editMotorStore",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/motor-store/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteMotorStore = createAsyncThunk(
  "motorStore/deleteMotorStore",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/motor-store/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

