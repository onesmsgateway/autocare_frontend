import { createSlice } from "@reduxjs/toolkit";
import {
  getAllListCompanyBranch,
  getListCompanyBranch,
  getAllListCompanyBranchNoManager,
} from "../../services/admin/companyBranch/companyBranch";

const initialState = {
  listCompanyBranch: null,
  isLoadCompanyBranch: false,
  allListCompanyBranch: null,
  isLoadCompanyBranchComplete: false,
  allListCompanyBranchNoManager: null,
  isLoadCompanyBranchNoManagerComplete: false,
};

const companyBranch = createSlice({
  name: "companyBranch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCompanyBranch.pending, (state) => {
        state.isLoadCompanyBranch = true;
      })
      .addCase(getListCompanyBranch.fulfilled, (state, action) => {
        state.listCompanyBranch = action.payload;
        state.isLoadCompanyBranch = false;
      })
      .addCase(getListCompanyBranch.rejected, (state) => {
        state.isLoadCompanyBranch = false;
      })
      .addCase(getAllListCompanyBranch.pending, (state) => {
        state.isLoadCompanyBranchComplete = true;
      })
      .addCase(getAllListCompanyBranch.fulfilled, (state, action) => {
        state.allListCompanyBranch = action.payload;
        state.isLoadCompanyBranchComplete = false;
      })
      .addCase(getAllListCompanyBranch.rejected, (state) => {
        state.isLoadCompanyBranchComplete = false;
      })
      .addCase(getAllListCompanyBranchNoManager.pending, (state) => {
        state.isLoadCompanyBranchNoManagerComplete = true;
      })
      .addCase(getAllListCompanyBranchNoManager.fulfilled, (state, action) => {
        state.allListCompanyBranchNoManager = action.payload;
        state.isLoadCompanyBranchNoManagerComplete = false;
      })
      .addCase(getAllListCompanyBranchNoManager.rejected, (state) => {
        state.isLoadCompanyBranchNoManagerComplete = false;
      });
  },
});

// export const {} = companyBranch.actions

export default companyBranch.reducer;
