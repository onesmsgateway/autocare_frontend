import { createSlice } from "@reduxjs/toolkit";
import { getListQuata } from "../../services/admin/quota/quota";

const initialState = {
  listQuota: null,
  isLoadListQuota: false,
};

const quota = createSlice({
  name: "quota",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListQuata.pending, (state) => {
        state.isLoadListQuota = true;
      })
      .addCase(getListQuata.fulfilled, (state, action) => {
        state.listQuota = action.payload;
        state.isLoadListQuota = false;
      })
      .addCase(getListQuata.rejected, (state) => {
        state.isLoadListQuota = false;
      });
  },
});

// export const {} = quota.actions;

export default quota.reducer;
