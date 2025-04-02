import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListVehicleMaintenance = createAsyncThunk(
  "vehicleMaintenance/getListVehicleMaintenance",
  async ({ currentPage, pageSize, status, search, type_job, job_id }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/company/api/v1/maintenance?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }

      if (type_job) {
        apiUrl += `&type_job=${type_job}`;
      }

      if (job_id) {
        apiUrl += `&job_id=${job_id}`;
      }
      // console.log(apiUrl);
      const response = await http.get(apiUrl);
      console.log("Check response:", response);

      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const getDetailVehicleMaintenance = createAsyncThunk(
  "vehicleMaintenance/getDetailVehicleMaintenance",
  async (id) => {
    // console.log({ currentPage, pageSize,value,branchId })
    try {
      let apiUrl = `/company/api/v1/maintenance/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getListEmployeMaintain = createAsyncThunk(
  "vehicleMaintenance/getListEmployeMaintain",
  async () => {
    try {
      let apiUrl = `/company/api/v1/employee-maintnance`;
      const response = await http.get(apiUrl);
      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createVehicleMaintenance = createAsyncThunk(
  "vehicleMaintenance/createVehicleMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/maintenance`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListAssignWork = createAsyncThunk(
  "vehicleMaintenance/getListAssignWork",
  async ({ currentPage, pageSize, value, maintenance_id }) => {
    try {
      let apiUrl = `/company/api/v1/assign-work?has_paginate&size=${pageSize}&page=${currentPage}`;
      // Kiểm tra nếu có giá trị tìm kiếm (value) và branchId
      if (value && maintenance_id) {
        apiUrl += `&search=${value}&maintenance_id=${maintenance_id}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (maintenance_id) {
        // Nếu chỉ có branchId
        apiUrl += `&maintenance_id=${maintenance_id}`;
      }
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createAssignWork = createAsyncThunk(
  "vehicleMaintenance/createAssignWork",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/assign-work`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteAssignWork = createAsyncThunk(
  "vehicleMaintenance/deleteAssignWork",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/assign-work/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteVehicleMaintenance = createAsyncThunk(
  "vehicleMaintenance/deleteVehicleMaintenance",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/maintenance/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editVehicleMaintenance = createAsyncThunk(
  "vehicleMaintenance/editVehicleMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/maintenance/${data.id}`,
        data
      );
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const payMent = createAsyncThunk(
  "vehicleMaintenance/payMent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/payment/api/v1/order-place`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
