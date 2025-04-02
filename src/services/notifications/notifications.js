import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListNotifications = createAsyncThunk(
  "notifications/getListNotifications",
  async ({ currentPage, pageSize }) => {
    try {
      let apiUrl = `/notification/api/v1/notifications?has_paginate&size=${pageSize}&page=${currentPage}&dir=DESC`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const updateStatusNotification = createAsyncThunk(
  "notifications/updateStatusNotification",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/notification/api/v1/notifications/${data.id}`,
        data
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
