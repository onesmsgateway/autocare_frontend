import { createSlice } from "@reduxjs/toolkit";
import { getListAccountManage } from "../../services/admin/accountManage/accountManage";

const initialState = {
  listAccountManage: null,
  isLoadAccountManage: false,
};

const accountManage = createSlice({
  name: "accountManage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListAccountManage.pending, (state) => {
        state.isLoadAccountManage = true;
      })
      .addCase(getListAccountManage.fulfilled, (state, action) => {
        state.listAccountManage = action.payload;
        state.isLoadAccountManage = false;
      })
      .addCase(getListAccountManage.rejected, (state) => {
        state.isLoadAccountManage = false;
      });
  },
});

// export const {} = accountManage.actions

export default accountManage.reducer;
