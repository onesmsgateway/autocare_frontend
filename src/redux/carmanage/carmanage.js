import { createSlice } from "@reduxjs/toolkit";
import {
  getDetailCarManage,
  getListCarManage,
} from "../../services/carmanage/carmanage";

const initialState = {
  listCarManage: null,
  isLoadCarManage: false,
  detailCarManager: null,
  isLoadDetailCarManage: false,
};

const carmanage = createSlice({
  name: "carmanage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCarManage.pending, (state) => {
        state.isLoadCarManage = true;
      })
      .addCase(getListCarManage.fulfilled, (state, action) => {
        state.listCarManage = action.payload;
        state.isLoadCarManage = false;
      })
      .addCase(getListCarManage.rejected, (state) => {
        state.isLoadCarManage = false;
      })
      .addCase(getDetailCarManage.pending, (state) => {
        state.isLoadDetailCarManage = true;
      })
      .addCase(getDetailCarManage.fulfilled, (state, action) => {
        state.detailCarManager = action.payload.data;
        state.isLoadDetailCarManage = false;
      })
      .addCase(getDetailCarManage.rejected, (state) => {
        state.isLoadDetailCarManage = false;
      });
  },
});

// export const {} = carmanage.actions;

export default carmanage.reducer;
