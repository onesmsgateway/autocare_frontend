import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const loginApp = createAsyncThunk(
    "login/loginApp",
    async (data, { rejectWithValue }) => {
      try {
        const response = await http.post(`/auth/api/v1/login`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
export const forgotPassWord = createAsyncThunk(
    "login/forgotPassWord",
    async (data, { rejectWithValue }) => {
      try {
        const response = await http.post(`/auth/api/v1/forgot-password`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
export const resetPassWord = createAsyncThunk(
    "login/resetPassWord",
    async (data, { rejectWithValue }) => {
      try {
        const response = await http.post(`/auth/api/v1/reset-password`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const verifyOtp = createAsyncThunk(
    "login/verifyOtp",
    async (data, { rejectWithValue }) => {
      try {
        const response = await http.post(`/auth/api/v1/verify-otp`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  