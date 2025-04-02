import { createSlice } from '@reduxjs/toolkit'
import { getAllListCompany, getListCompany } from '../../services/admin/company/company';

const initialState = {
    listCompany:null,
    isLoadCompany:false,
    allListCompany:null,
    isLoadCompanyComplete:false,
}

const company = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListCompany.pending, (state) => {
        state.isLoadCompany = true;
      })
      .addCase(getListCompany.fulfilled, (state, action) => {
        state.listCompany = action.payload;
        state.isLoadCompany = false;
      })
      .addCase(getListCompany.rejected, (state) => {
        state.isLoadCompany = false;
      })
      .addCase(getAllListCompany.pending, (state) => {
        state.isLoadCompanyComplete = true;
      })
      .addCase(getAllListCompany.fulfilled, (state, action) => {
        state.allListCompany = action.payload;
        state.isLoadCompanyComplete = false;
      })
      .addCase(getAllListCompany.rejected, (state) => {
        state.isLoadCompanyComplete = false;
      })
  },
});

// export const {} = company.actions

export default company.reducer