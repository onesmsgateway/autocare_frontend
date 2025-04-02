import { createSlice } from "@reduxjs/toolkit";
import {
  getListTimekeeping,
  getDetailTimekeeping,
  getListStaffRequest,
  getListLeaveTypeSetting,
  getListDayOffSetting,
  getListAllEmployee,
  getListUserMachine,
} from "../../services/timekeeping/timekeeping";

const initialState = {
  listTimekeeping: null,
  isLoadTimekeeping: false,
  detailTimekeeping: null,
  isLoadDetailTimekeeping: false,
  listStaffRequest: null,
  isLoadListStaffRequest: false,
  listTimekeepingCheckActive: null,
  isLoadListTimekeepingCheckActive: false,
  listLeaveTypeSetting: null,
  isLoadListLeaveTypeSetting: false,
  listDayOffSetting: null,
  isLoadListDayOffSetting: false,
  listAllEmployee: null,
  isLoadListAllEmployee: false,
  listUserMachine: null,
  isLoadListUserMachine: false,
};

const timekeeping = createSlice({
  name: "timekeeping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListTimekeeping.pending, (state) => {
        state.isLoadTimekeeping = true;
      })
      .addCase(getListTimekeeping.fulfilled, (state, action) => {
        state.listTimekeeping = action.payload;
        state.isLoadTimekeeping = false;
      })
      .addCase(getListTimekeeping.rejected, (state) => {
        state.isLoadTimekeeping = false;
      })
      .addCase(getDetailTimekeeping.pending, (state) => {
        state.isLoadDetailTimekeeping = true;
      })
      .addCase(getDetailTimekeeping.fulfilled, (state, action) => {
        state.detailTimekeeping = action.payload.data;
        state.isLoadDetailTimekeeping = false;
      })
      .addCase(getDetailTimekeeping.rejected, (state) => {
        state.isLoadDetailTimekeeping = false;
      })
      .addCase(getListStaffRequest.pending, (state) => {
        state.isLoadListStaffRequest = true;
      })
      .addCase(getListStaffRequest.fulfilled, (state, action) => {
        state.listStaffRequest = action.payload;
        state.isLoadListStaffRequest = false;
      })
      .addCase(getListStaffRequest.rejected, (state) => {
        state.isLoadListStaffRequest = false;
      })
      .addCase(getListLeaveTypeSetting.pending, (state) => {
        state.isLoadListLeaveTypeSetting = true;
      })
      .addCase(getListLeaveTypeSetting.fulfilled, (state, action) => {
        state.listLeaveTypeSetting = action.payload;
        state.isLoadListLeaveTypeSetting = false;
      })
      .addCase(getListLeaveTypeSetting.rejected, (state) => {
        state.isLoadListLeaveTypeSetting = false;
      })
      .addCase(getListDayOffSetting.pending, (state) => {
        state.isLoadListDayOffSetting = true;
      })
      .addCase(getListDayOffSetting.fulfilled, (state, action) => {
        state.listDayOffSetting = action.payload;
        state.isLoadListDayOffSetting = false;
      })
      .addCase(getListDayOffSetting.rejected, (state) => {
        state.isLoadListDayOffSetting = false;
      })
      .addCase(getListAllEmployee.pending, (state) => {
        state.isLoadListAllEmployee = true;
      })
      .addCase(getListAllEmployee.fulfilled, (state, action) => {
        state.listAllEmployee = action.payload;
        state.isLoadListAllEmployee = false;
      })
      .addCase(getListAllEmployee.rejected, (state) => {
        state.isLoadListAllEmployee = false;
      })
      .addCase(getListUserMachine.pending, (state) => {
        state.isLoadListUserMachine = true;
      })
      .addCase(getListUserMachine.fulfilled, (state, action) => {
        state.listUserMachine = action.payload;
        state.isLoadListUserMachine = false;
      })
      .addCase(getListUserMachine.rejected, (state) => {
        state.isLoadListUserMachine = false;
      });
  },
});

// export const {} = timekeeping.actions;

export default timekeeping.reducer;
