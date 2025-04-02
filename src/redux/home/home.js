import { createSlice } from "@reduxjs/toolkit";
import {
  getListBarChart,
  getListTotal,
  getListTotalWorker,
} from "../../services/home/home";

const initialState = {
  listToTalDashboard: null,
  isLoadToTalDashboard: false,
  listBarChart: null,
  listTotalWorker: null,
};

const home = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListTotal.pending, (state) => {
        state.isLoadToTalDashboard = true;
      })
      .addCase(getListTotal.fulfilled, (state, action) => {
        state.listToTalDashboard = action.payload;
        state.isLoadToTalDashboard = false;
      })
      .addCase(getListTotal.rejected, (state) => {
        state.isLoadToTalDashboard = false;
      })
      .addCase(getListBarChart.fulfilled, (state, action) => {
        state.listBarChart = action.payload.data;
      })
      .addCase(getListTotalWorker.fulfilled, (state, action) => {
        state.listTotalWorker = action.payload.data;
      });
  },
});

// export const {} = home.actions

export default home.reducer;
