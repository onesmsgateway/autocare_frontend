import { createSlice } from "@reduxjs/toolkit";
import {
  getAllListCustomer,
  getListCustomer,
} from "../../services/customer/customer";

const initialState = {
  listCustomer: null,
  loading: false,
  allListCustomer: null,
  isLoadingAll: false,
};

const customer = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListCustomer.fulfilled, (state, action) => {
        state.listCustomer = action.payload;
        state.loading = false;
      })
      .addCase(getListCustomer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllListCustomer.pending, (state) => {
        state.isLoadingAll = true;
      })
      .addCase(getAllListCustomer.fulfilled, (state, action) => {
        state.allListCustomer = action.payload;
        state.isLoadingAll = false;
      })
      .addCase(getAllListCustomer.rejected, (state) => {
        state.isLoadingAll = false;
      });
  },
});

// export const {} = customer.actions;

export default customer.reducer;
