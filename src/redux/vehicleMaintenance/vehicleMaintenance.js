import { createSlice } from "@reduxjs/toolkit";
import { getDetailVehicleMaintenance, getListAssignWork, getListVehicleMaintenance } from "../../services/vehicleMaintenance/vehicleMaintenance";

const initialState = {
  listVehicleMaintenance: null,
  isLoadVehicleMaintenance: false,
  detailVehicleMaintenance:null,
  isLoadDetailVehicleMaintenance:false,
  listAssignWork:null,
  isLoadAssignWork:false
};

const vehicleMaintenance = createSlice({
  name: "vehicleMaintenance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListVehicleMaintenance.pending, (state) => {
        state.isLoadVehicleMaintenance = true;
      })
      .addCase(getListVehicleMaintenance.fulfilled, (state, action) => {
        state.listVehicleMaintenance = action.payload;
        state.isLoadVehicleMaintenance = false;
      })
      .addCase(getListVehicleMaintenance.rejected, (state) => {
        state.isLoadVehicleMaintenance = false;
      })
      .addCase(getDetailVehicleMaintenance.pending, (state) => {
        state.isLoadDetailVehicleMaintenance = true;
      })
      .addCase(getDetailVehicleMaintenance.fulfilled, (state, action) => {
        state.detailVehicleMaintenance = action.payload.data;
        state.isLoadDetailVehicleMaintenance = false;
      })
      .addCase(getDetailVehicleMaintenance.rejected, (state) => {
        state.isLoadDetailVehicleMaintenance = false;
      })
      .addCase(getListAssignWork.pending, (state) => {
        state.isLoadAssignWork = true;
      })
      .addCase(getListAssignWork.fulfilled, (state, action) => {
        state.listAssignWork = action.payload.data;
        state.isLoadAssignWork = false;
      })
      .addCase(getListAssignWork.rejected, (state) => {
        state.isLoadAssignWork = false;
      })
  },
});

// export const {} = vehicleMaintenance.actions

export default vehicleMaintenance.reducer;
