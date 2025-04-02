import { createSlice } from "@reduxjs/toolkit";
import { getListScheduleSms, getListSms, getListTemplateSms } from "../../services/sms/sms";
import { getActiveSms } from "../../services/sms/activeSms";

const initialState = {
  listSms: null,
  isLoadigSms: false,
  listTemplateSms: null,
  isLoadingTemplateSms: false,
  listActiveSms: null,
  isLoadigSmsActive: false,
  listScheduleSms:null,
  isLoadListScheduleSms: false,
};

const sms = createSlice({
  name: "sms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListSms.pending, (state) => {
        state.isLoadigSms = true;
      })
      .addCase(getListSms.fulfilled, (state, action) => {
        state.listSms = action.payload;
        state.isLoadigSms = false;
      })
      .addCase(getListSms.rejected, (state) => {
        state.isLoadigSms = false;
      })
      .addCase(getListTemplateSms.pending, (state) => {
        state.isLoadingTemplateSms = true;
      })
      .addCase(getListTemplateSms.fulfilled, (state, action) => {
        state.listTemplateSms = action.payload;
        state.isLoadingTemplateSms = false;
      })
      .addCase(getListTemplateSms.rejected, (state) => {
        state.isLoadingTemplateSms = false;
      })
      .addCase(getActiveSms.pending, (state) => {
        state.isLoadigSmsActive = true;
      })
      .addCase(getActiveSms.fulfilled, (state, action) => {
        state.listActiveSms = action.payload.data;
        state.isLoadigSmsActive = false;
      })
      .addCase(getActiveSms.rejected, (state) => {
        state.isLoadigSmsActive = false;
      })
      .addCase(getListScheduleSms.pending, (state) => {
        state.isLoadListScheduleSms = true;
      })
      .addCase(getListScheduleSms.fulfilled, (state, action) => {
        state.listScheduleSms = action.payload.data;
        state.isLoadListScheduleSms = false;
      })
      .addCase(getListScheduleSms.rejected, (state) => {
        state.isLoadListScheduleSms = false;
      });
  },
});

// export const {} = sms.actions;

export default sms.reducer;
