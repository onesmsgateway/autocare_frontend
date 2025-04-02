import { createSlice } from "@reduxjs/toolkit";
import { getAllListStaff, getListStaff } from "../../services/staff/staff";
import { getListEmployeMaintain } from "../../services/vehicleMaintenance/vehicleMaintenance";

const initialState = {
  listStaff: null,
  isLoadStaff: false,
  allListStaff:null,
  isLoadAllStaff:false,
  listStaffCheckActive:null,
  isLoadListStaffCheckActive:false
};

const staff = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListStaff.pending, (state) => {
        state.isLoadStaff = true;
      })
      .addCase(getListStaff.fulfilled, (state, action) => {
        state.listStaff = action.payload;
        state.isLoadStaff = false;
      })
      .addCase(getListStaff.rejected, (state) => {
        state.isLoadStaff = false;
      })
      .addCase(getAllListStaff.pending, (state) => {
        state.isLoadAllStaff = true;
      })
      .addCase(getAllListStaff.fulfilled, (state, action) => {
        state.allListStaff = action.payload;
        state.isLoadAllStaff = false;
      })
      .addCase(getAllListStaff.rejected, (state) => {
        state.isLoadAllStaff = false;
      })
      .addCase(getListEmployeMaintain.pending, (state) => {
        state.isLoadListStaffCheckActive = true;
      })
      .addCase(getListEmployeMaintain.fulfilled, (state, action) => {
        state.listStaffCheckActive = action.payload;
        state.isLoadListStaffCheckActive = false;
      })
      .addCase(getListEmployeMaintain.rejected, (state) => {
        state.isLoadListStaffCheckActive = false;
      })
  },
});

// export const {} = staff.actions;

export default staff.reducer;
