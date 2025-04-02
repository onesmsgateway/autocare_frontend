import { createSlice } from '@reduxjs/toolkit'
import { getAllListPosition, getListPosition } from '../../services/position/position';

const initialState = {
    listPositions:null,
    isLoadPositions:false,
    allListPositions:null,
    isLoadingAllPositions:false,
}

const position = createSlice({
  name: "position",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListPosition.pending, (state) => {
        state.isLoadPositions = true;
      })
      .addCase(getListPosition.fulfilled, (state, action) => {
        state.listPositions = action.payload;
        state.isLoadPositions = false;
      })
      .addCase(getListPosition.rejected, (state) => {
        state.isLoadPositions = false;
      })
      .addCase(getAllListPosition.pending, (state) => {
        state.isLoadingAllPositions = true;
      })
      .addCase(getAllListPosition.fulfilled, (state, action) => {
        state.allListPositions = action.payload;
        state.isLoadingAllPositions = false;
      })
      .addCase(getAllListPosition.rejected, (state) => {
        state.isLoadingAllPositions = false;
      });
  },
});

export const {} = position.actions

export default position.reducer