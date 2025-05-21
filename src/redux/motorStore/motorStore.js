import { createSlice } from '@reduxjs/toolkit'
import { getListMotorStore } from '../../services/motorStore/motorStore';

const initialState = {
    listMotorStore:null,
    isLoadMotorStore:false,
}

const motorStore = createSlice({
  name: "motorStore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListMotorStore.pending, (state) => {
        state.isLoadMotorStore = true;
      })
      .addCase(getListMotorStore.fulfilled, (state, action) => {
        state.listMotorStore = action.payload;
        state.isLoadMotorStore = false;
      })
      .addCase(getListMotorStore.rejected, (state) => {
        state.isLoadMotorStore = false;
      });
  },
});

export const {} = motorStore.actions

export default motorStore.reducer