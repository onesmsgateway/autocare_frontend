import { createSlice } from '@reduxjs/toolkit'
import { getListJob } from '../../services/job/job';

const initialState = {
    listJobs:null,
    isLoadJobs:false
}

const job = createSlice({
  name: "job",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListJob.pending, (state) => {
        state.isLoadJobs = true;
      })
      .addCase(getListJob.fulfilled, (state, action) => {
        state.listJobs = action.payload;
        state.isLoadJobs = false;
      })
      .addCase(getListJob.rejected, (state) => {
        state.isLoadJobs = false;
      });
  },
});

export const {} = job.actions

export default job.reducer