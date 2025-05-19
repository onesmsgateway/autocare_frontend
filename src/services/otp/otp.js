import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const generateUpdateOtp  = createAsyncThunk(
    "otp/generateUpdateOtp ",
    async (data, { rejectWithValue }) => {
      try {
        const response = await http.post(
          `/company/api/v1/otp/generate-update-otp`,
          data
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const verifyUpdateOtp  = createAsyncThunk(
    "otp/verifyUpdateOtp ",
    async (data, { rejectWithValue }) => {
      try {
        const response = await http.post(
          `/company/api/v1/otp/verify-update-otp`,
          data
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  