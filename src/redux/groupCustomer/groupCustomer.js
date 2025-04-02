import { createSlice } from '@reduxjs/toolkit'
import { getAllListGroupCustomer, getListGroupCustomer } from '../../services/groupCustomer/groupCustomer';

const initialState = {
    listgroupCusomer:null,
    isloading:false,
    allListgroupCustomer:null,
    isLoadingAll:false
}

const groupCustomer = createSlice({
  name: "groupCustomer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListGroupCustomer.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getListGroupCustomer.fulfilled, (state, action) => {
        state.listgroupCusomer = action.payload;
        state.isloading = false;
      })
      .addCase(getListGroupCustomer.rejected, (state) => {
        state.isloading = false;
      })
      .addCase(getAllListGroupCustomer.pending, (state) => {
        state.isLoadingAll = true;
      })
      .addCase(getAllListGroupCustomer.fulfilled, (state, action) => {
        state.allListgroupCustomer = action.payload;
        state.isLoadingAll = false;
      })
      .addCase(getAllListGroupCustomer.rejected, (state) => {
        state.isLoadingAll = false;
      })
  },
});

export const {} = groupCustomer.actions

export default groupCustomer.reducer