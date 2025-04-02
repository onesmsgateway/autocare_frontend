import { createSlice } from "@reduxjs/toolkit";
import { getAllListSupplier, getListSupplier } from "../../services/supplier/supplier";

const initialState = {
  listSupplier: null,
  isLoadSupplier: false,
  allListSupplier:null,
  isLoadAllSupplier:false,
};

const supplier = createSlice({
  name: "supplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListSupplier.pending, (state) => {
        state.isLoadSupplier = true;
      })
      .addCase(getListSupplier.fulfilled, (state, action) => {
        state.listSupplier = action.payload;
        state.isLoadSupplier = false;
      })
      .addCase(getListSupplier.rejected, (state) => {
        state.isLoadSupplier = false;
      })
      .addCase(getAllListSupplier.pending, (state) => {
        state.isLoadAllSupplier = true;
      })
      .addCase(getAllListSupplier.fulfilled, (state, action) => {
        state.allListSupplier = action.payload;
        state.isLoadAllSupplier = false;
      })
      .addCase(getAllListSupplier.rejected, (state) => {
        state.isLoadAllSupplier = false;
      })
  },
});

export const {} = supplier.actions;

export default supplier.reducer;
