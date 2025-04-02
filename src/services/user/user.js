import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getInfoUser = createAsyncThunk("user/getInfoUser", async () => {
  try {
    const response = await http.get(`/auth/api/v1/get-user`);
    // console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
});
export const editPassWord = createAsyncThunk(
  "user/editPassWord",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/auth/api/v1/user/${data.id}/reset-password`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updatePhone = createAsyncThunk(
  "user/updatePhone",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(
        `/auth/api/v1/user/${data.id}/update-phone`,
        data
      );
      // console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createAccountBank = createAsyncThunk(
  "user/createAccountBank",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/payment/api/v1/payments`, data);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getInfoAccoutBank = createAsyncThunk(
  "user/getInfoAccoutBank",
  async () => {
    try {
      const response = await http.get(`/payment/api/v1/payments`);
      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
