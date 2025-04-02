import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListMiniDashboardEmployees = createAsyncThunk(
  "miniDashboard/getListMiniDashboardEmployees",
  async ({ currentPage, pageSize, search, status }) => {
    try {
      let apiUrl = `/api/v1/mini-dashboard/manager/employee?size=${pageSize}&page=${currentPage}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getListMiniDashboardCustomers = createAsyncThunk(
  "miniDashboard/getListMiniDashboardCustomers",
  async ({ currentPage, pageSize, search, status }) => {
    try {
      let apiUrl = `/api/v1/mini-dashboard/manager/customer?size=${pageSize}&page=${currentPage}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getListMiniDashboardTimekeeping = createAsyncThunk(
  "miniDashboard/getListMiniDashboardTimekeeping",
  async ({
    currentPage,
    pageSize,
    search,
    status,
    time_period,
    month,
    year,
  }) => {
    try {
      let apiUrl = `/api/v1/mini-dashboard/manager/timekeeping?size=${pageSize}&page=${currentPage}&time_period=${time_period}&month=${month}&year=${year}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getListMiniDashboardQuota = createAsyncThunk(
  "miniDashboard/getListMiniDashboardQuota",
  async ({ currentPage, pageSize, search, status }) => {
    try {
      let apiUrl = `/api/v1/mini-dashboard/manager/quota?size=${pageSize}&page=${currentPage}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
