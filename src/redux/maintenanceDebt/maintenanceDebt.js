import { createSlice } from '@reduxjs/toolkit';
import { getListMaintenanceDebt } from '../../services/maintenanceDebt/maintenanceDebt'

const initialState = {
    listMaintenanceDebt:null,
    isLoadMaintenanceDebt:false,
    allListMaintenanceDebt:null,
    isLoadAllMaintenanceDebt:false
}
console.log('listMaintenanceDebt', getListMaintenanceDebt);

const maintenanceDebt = createSlice({
  name: "maintenanceDebt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListMaintenanceDebt.pending, (state) => {
        state.isLoadMaintenanceDebt = true;
      })
      .addCase(getListMaintenanceDebt.fulfilled, (state, action) => {
        state.listMaintenanceDebt = action.payload;
        state.isLoadMaintenanceDebt = false;
      })
      .addCase(getListMaintenanceDebt.rejected, (state) => {
        state.isLoadMaintenanceDebt = false;
      })
  },
});


export default maintenanceDebt.reducer