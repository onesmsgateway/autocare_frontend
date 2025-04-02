import { createSlice } from '@reduxjs/toolkit'
import { getListNotifications } from '../../services/notifications/notifications';

const initialState = {
    listNotifications:null,
    isLoadlistNotifications:false
}

const notifications = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListNotifications.pending, (state) => {
        state.isLoadlistNotifications = true;
      })
      .addCase(getListNotifications.fulfilled, (state, action) => {
        state.listNotifications = action.payload;
        state.isLoadlistNotifications = false;
      })
      .addCase(getListNotifications.rejected, (state) => {
        state.isLoadlistNotifications = false;
      });
  },

});

// export const {} = notifications.actions

export default notifications.reducer