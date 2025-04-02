import { createSlice } from '@reduxjs/toolkit'
import { getListAccount } from '../../services/admin/account/account';

const initialState = {
    listAccount:null,
    isLoadAccount:false,
  
}

const account = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListAccount.pending, (state) => {
        state.isLoadAccount = true;
      })
      .addCase(getListAccount.fulfilled, (state, action) => {
        state.listAccount = action.payload;
        state.isLoadAccount = false;
      })
      .addCase(getListAccount.rejected, (state) => {
        state.isLoadAccount = false;
      });
  },
});

// export const {} = account.actions

export default account.reducer