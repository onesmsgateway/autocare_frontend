import { createSlice } from '@reduxjs/toolkit'
import { getAllListJobCateGory, getListJobCateGory } from '../../services/jobCateGory/jobCateGory';

const initialState = {
  listJobsCateGory: null,
  isLoadJobsCategory: false,
  allListJobCateGory: null,
  isLoadAllJobsCategory: false
}

const jobCategory = createSlice({
  name: "jobCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListJobCateGory.pending, (state) => {
        state.isLoadJobsCategory = true;
      })
      .addCase(getListJobCateGory.fulfilled, (state, action) => {
        state.listJobsCateGory = action.payload;
        state.isLoadJobsCategory = false;
      })
      .addCase(getListJobCateGory.rejected, (state) => {
        state.isLoadJobsCategory = false;
      })
      .addCase(getAllListJobCateGory.pending, (state) => {
        state.isLoadAllJobsCategory = true;
      })
      .addCase(getAllListJobCateGory.fulfilled, (state, action) => {
        state.allListJobCateGory = action.payload;
        state.isLoadAllJobsCategory = false;
      })
      .addCase(getAllListJobCateGory.rejected, (state) => {
        state.isLoadAllJobsCategory = false;
      })
  },
});


export default jobCategory.reducer