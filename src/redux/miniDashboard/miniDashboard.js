import { createSlice } from "@reduxjs/toolkit";
import {
  getListMiniDashboardCustomers,
  getListMiniDashboardEmployees,
  getListMiniDashboardTimekeeping,
  getListMiniDashboardQuota,
} from "../../services/miniDashboard/miniDashboard";
const initialState = {
  listMiniDashboardEmployees: null,
  isLoadListMiniDashboardEmployees: false,
  listMiniDashboardCustomers: null,
  isLoadListMiniDashboardCustomers: false,
  listMiniDashboardTimekeeping: null,
  isLoadListMiniDashboardTimekeeping: false,
  listMiniDashboardQuota: null,
  isLoadListMiniDashboardQuota: false,
};

const post = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListMiniDashboardEmployees.pending, (state) => {
        state.isLoadListMiniDashboardEmployees = true;
      })
      .addCase(getListMiniDashboardEmployees.fulfilled, (state, action) => {
        state.listMiniDashboardEmployees = action.payload;
        state.isLoadListMiniDashboardEmployees = false;
      })
      .addCase(getListMiniDashboardEmployees.rejected, (state) => {
        state.isLoadListMiniDashboardEmployees = false;
      })
      .addCase(getListMiniDashboardCustomers.pending, (state) => {
        state.isLoadListMiniDashboardCustomers = true;
      })
      .addCase(getListMiniDashboardCustomers.fulfilled, (state, action) => {
        state.listMiniDashboardCustomers = action.payload;
        state.isLoadListMiniDashboardCustomers = false;
      })
      .addCase(getListMiniDashboardCustomers.rejected, (state) => {
        state.isLoadListMiniDashboardCustomers = false;
      })
      .addCase(getListMiniDashboardTimekeeping.pending, (state) => {
        state.isLoadListMiniDashboardTimekeeping = true;
      })
      .addCase(getListMiniDashboardTimekeeping.fulfilled, (state, action) => {
        state.listMiniDashboardTimekeeping = action.payload;
        state.isLoadListMiniDashboardTimekeeping = false;
      })
      .addCase(getListMiniDashboardTimekeeping.rejected, (state) => {
        state.isLoadListMiniDashboardTimekeeping = false;
      })
      .addCase(getListMiniDashboardQuota.pending, (state) => {
        state.isLoadListMiniDashboardQuota = true;
      })
      .addCase(getListMiniDashboardQuota.fulfilled, (state, action) => {
        state.listMiniDashboardQuota = action.payload;
        state.isLoadListMiniDashboardQuota = false;
      })
      .addCase(getListMiniDashboardQuota.rejected, (state) => {
        state.isLoadListMiniDashboardQuota = false;
      });
  },
});

// export const {} = post.actions;

export default post.reducer;
