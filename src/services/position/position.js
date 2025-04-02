import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListPosition = createAsyncThunk(
  "position/getListPosition",
  async ({ currentPage, pageSize, search, branchId }) => {
    try {
      let apiUrl = `/company/api/v1/position?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (search && branchId) {
        apiUrl += `&search=${search}&branch_first_id=${branchId}`;
      } else if (search) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${search}`;
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
export const getAllListPosition = createAsyncThunk(
  "position/getAllListPosition",
  async () => {
    try {
      let apiUrl = `/company/api/v1/position`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getPosition = createAsyncThunk(
  "position/getPosition",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/position/${id}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createPosition = createAsyncThunk(
  "position/createPosition",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/position`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const editPosition = createAsyncThunk(
  "position/editPosition",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/position/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deletePosition = createAsyncThunk(
  "position/deletePosition",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/company/api/v1/position/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListPositionPermission = createAsyncThunk(
  "position-permission/getListPositionPermission",
  async () => {
    try {
      let apiUrl = `/company/api/v1/position-permissions`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getListPermissionByPosition = createAsyncThunk(
  "permission-by-position/getListPermissionByPosition",
  async (positionId) => {
    try {
      let apiUrl = `/company/api/v1/position/${positionId}/position-permissions`;
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const assignPermissionForPosition = createAsyncThunk(
  "assign-permission-for-position/assignPermissionForPosition",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/company/api/v1/assign-permissions`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
