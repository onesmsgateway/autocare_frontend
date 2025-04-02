import { createSlice } from "@reduxjs/toolkit";
import { getAllListAccessarys, getListAccessarys } from "../../services/accessarys/accessarys";

const initialState = {
  listAccessarys: null,
  isLoadAccessarys: false,
  allListAccessarys:null,
  isLoadAccessarysAll: false,
};

const accessarys = createSlice({
  name: "accessarys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListAccessarys.pending, (state) => {
        state.isLoadAccessarys = true;
      })
      .addCase(getListAccessarys.fulfilled, (state, action) => {
        state.listAccessarys = action.payload;
        state.isLoadAccessarys = false;
      })
      .addCase(getListAccessarys.rejected, (state) => {
        state.isLoadAccessarys = false;
      })
      .addCase(getAllListAccessarys.pending, (state) => {
        state.isLoadAccessarysAll = true;
      })
      .addCase(getAllListAccessarys.fulfilled, (state, action) => {
        state.allListAccessarys = action.payload;
        state.isLoadAccessarysAll = false;
      })
      .addCase(getAllListAccessarys.rejected, (state) => {
        state.isLoadAccessarysAll = false;
      })
  },
});

// export const {} = accessarys.actions

export default accessarys.reducer;
