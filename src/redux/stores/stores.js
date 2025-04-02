import { createSlice } from "@reduxjs/toolkit";
import { getAllListStores, getListStores } from "../../services/stores/stores";

const initialState = {
  listStores: null,
  isLoadStores: false,
  allListStores:null,
  isLoadStoresAll: false
};

const stores = createSlice({
  name: "stores",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListStores.pending, (state) => {
        state.isLoadStores = true;
      })
      .addCase(getListStores.fulfilled, (state, action) => {
        state.listStores = action.payload;
        state.isLoadStores = false;
      })
      .addCase(getListStores.rejected, (state) => {
        state.isLoadStores = false;
      })
      .addCase(getAllListStores.pending, (state) => {
        state.isLoadStoresAll = true;
      })
      .addCase(getAllListStores.fulfilled, (state, action) => {
        state.allListStores = action.payload;
        state.isLoadStoresAll = false;
      })
      .addCase(getAllListStores.rejected, (state) => {
        state.isLoadStoresAll = false;
      });
  },
});

export const {} = stores.actions;

export default stores.reducer;
