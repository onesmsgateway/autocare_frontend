import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListTotal = createAsyncThunk(
  "home/getListTotal",
  async ({ time_start, time_end, type }) => {
    try {
      let apiUrl = `/dashboard/api/v1/dashboard?time_start=${time_start}&time_end=${time_end}&type=${type}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListBarChart = createAsyncThunk(
  "home/getListBarChart",
  async ({ time_start, time_end, type }) => {
    try {
      let apiUrl = `/dashboard/api/v1/dashboard-chart?time_start=${time_start}&time_end=${time_end}&type=${type}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getListTotalWorker = createAsyncThunk(
  "home/getListTotalWorker",
  async ({ time_start, time_end, type }) => {
    try {
      let apiUrl = `/dashboard/api/v1/dashboard-employee?time_start=${time_start}&time_end=${time_end}&type=${type}`;
      const response = await http.get(apiUrl);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
