import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../../utils/config";
export const getListQuata = createAsyncThunk(
  "admin/quata/getListQuata",
  async ({ currentPage, pageSize, value, branchId }) => {
    try {
      let apiUrl = `/company/api/v1/admin/quotas?has_paginate&size=${pageSize}&page=${currentPage}`;
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
      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createQuata = createAsyncThunk(
  "admin/quata/createQuata",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/company/api/v1/admin/quotas`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const changeQuata = createAsyncThunk(
  "admin/quata/changeQuata",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/company/api/v1/admin/quotas/conversion-quota`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editQuota = createAsyncThunk(
  "admin/quata/editQuota",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/company/api/v1/admin/quotas/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// export const deleteBranchName = createAsyncThunk(
//   "admin/branchname/deleteBranchName",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await http.delete(`/company/api/v1/trademark/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
