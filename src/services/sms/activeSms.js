import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const activeSms = createAsyncThunk(
  "sms/activeSms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/sms-active`, data);
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getActiveSms = createAsyncThunk("sms/getActiveSms", async () => {
  try {
    let apiUrl = `/sms/api/v1/sms-active`;
    const response = await http.get(apiUrl);
    // console.log(response)
    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});
