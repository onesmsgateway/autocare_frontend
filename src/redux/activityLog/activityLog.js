import { createSlice } from "@reduxjs/toolkit";
import { getListActivityLogs } from "../../services/activityLog/activityLog";

const initialState = {
  listActivityLogs: null,
  isLoadActivityLogs: false,
};

const activityLog = createSlice({
  name: "activityLog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListActivityLogs.pending, (state) => {
        state.isLoadActivityLogs = true;
      })
      .addCase(getListActivityLogs.fulfilled, (state, action) => {
        state.listActivityLogs = action.payload;
        state.isLoadActivityLogs = false;
      })
      .addCase(getListActivityLogs.rejected, (state) => {
        state.isLoadActivityLogs = false;
      })
  },
});

// export const {} = accessarys.actions

export default activityLog.reducer;
