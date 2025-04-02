import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetchData: false,
  filters: "DangBaoDuong",
  fetchDashBoard: false,
};

const hasFetchData = createSlice({
  name: "hasFetchData",
  initialState,
  reducers: {
    setHasFetchData: (state, action) => {
      state.fetchData = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setFetchDashBoard: (state, action) => {
      state.fetchDashBoard = action.payload;
    },
  },
});

export const { setHasFetchData, setFilters, setFetchDashBoard } =
  hasFetchData.actions;

export default hasFetchData.reducer;
