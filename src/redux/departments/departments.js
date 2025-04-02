import { createSlice } from "@reduxjs/toolkit";
import { getAllListDepartments, getListDepartments } from "../../services/department/department";

const initialState = {
  listDepartments: null,
  isLoadDepartments: false,
  allListDepartments:null,
  isLoadAllDepartments: false,
};

const departments = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListDepartments.pending, (state) => {
        state.isLoadDepartments = true;
      })
      .addCase(getListDepartments.fulfilled, (state, action) => {
        state.listDepartments = action.payload;
        state.isLoadDepartments = false;
      })
      .addCase(getListDepartments.rejected, (state) => {
        state.isLoadDepartments = false;
      })
      .addCase(getAllListDepartments.pending, (state) => {
        state.isLoadAllDepartments = true;
      })
      .addCase(getAllListDepartments.fulfilled, (state, action) => {
        state.allListDepartments = action.payload;
        state.isLoadAllDepartments = false;
      })
      .addCase(getAllListDepartments.rejected, (state) => {
        state.isLoadAllDepartments = false;
      })
  },
});

export const {} = departments.actions;

export default departments.reducer;
