import { createSlice } from "@reduxjs/toolkit";
import { getListBranchName } from "../../services/admin/branchname/branchname";

const initialState = {
  listBranchName: null,
  isLoadBranchName: false,
};

const branchname = createSlice({
  name: "branchname",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListBranchName.pending, (state) => {
        state.isLoadBranchName = true;
      })
      .addCase(getListBranchName.fulfilled, (state, action) => {
        state.listBranchName = action.payload;
        state.isLoadBranchName = false;
      })
      .addCase(getListBranchName.rejected, (state) => {
        state.isLoadBranchName = false;
      });
  },
});

// export const {} = branchname.actions;

export default branchname.reducer;
