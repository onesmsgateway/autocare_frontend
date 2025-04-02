import { createSlice } from "@reduxjs/toolkit";
import { getListWareHouse } from "../../services/warehouse/warehouse";

const initialState = {
  listWarehouse: null,
  isLoadWarehouse: false,
};

const warehouse = createSlice({
  name: "warehouse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListWareHouse.pending, (state) => {
        state.isLoadWarehouse = true;
      })
      .addCase(getListWareHouse.fulfilled, (state, action) => {
        state.listWarehouse = action.payload;
        state.isLoadWarehouse = false;
      })
      .addCase(getListWareHouse.rejected, (state) => {
        state.isLoadWarehouse = false;
      });
  },
});

// export const {} = warehouse.actions;

export default warehouse.reducer;
