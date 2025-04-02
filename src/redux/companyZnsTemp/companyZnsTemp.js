import { createSlice } from "@reduxjs/toolkit";
import {
  getAllListCompanyZnsTemp,
  getListCompanyZnsTemp,
} from "../../services/admin/companyZnsTemp/companyZnsTemp";

const initialState = {
  listCompanyZnsTemp: null,
  isLoadCompanyZnsTemp: false,
  allListCompanyZnsTemp: null,
  isLoadCompanyZnsTempComplete: false,
};

const companyZnsTemp = createSlice({
  name: "companyZnsTemp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCompanyZnsTemp.pending, (state) => {
        state.isLoadCompanyZnsTemp = true;
      })
      .addCase(getListCompanyZnsTemp.fulfilled, (state, action) => {
        state.listCompanyZnsTemp = action.payload;
        state.isLoadCompanyZnsTemp = false;
      })
      .addCase(getListCompanyZnsTemp.rejected, (state) => {
        state.isLoadCompanyZnsTemp = false;
      })
      .addCase(getAllListCompanyZnsTemp.pending, (state) => {
        state.isLoadCompanyZnsTempComplete = true;
      })
      .addCase(getAllListCompanyZnsTemp.fulfilled, (state, action) => {
        state.allListCompanyZnsTemp = action.payload;
        state.isLoadCompanyZnsTempComplete = false;
      })
      .addCase(getAllListCompanyZnsTemp.rejected, (state) => {
        state.isLoadCompanyZnsTempComplete = false;
      });
  },
});

export default companyZnsTemp.reducer;
