import { createSlice } from "@reduxjs/toolkit";
import { getInfoAccoutBank, getInfoUser } from "../../services/user/user";
import { settings } from "../../utils/config";

const initialState = {
  userData: null,
  isLoadUserData: false,
  infoAccountBank: null,
  isLoadInfoAccountBank: false,
};
const companyId = settings?.getCookie("company_id");

const user = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfoUser.pending, (state) => {
        state.isLoadUserData = true;
      })
      .addCase(getInfoUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        if (companyId !== action?.payload?.data?.company_id) {
          settings.setCookie(
            "company_id",
            action?.payload?.data?.company_id,
            30
          );
        }
        state.isLoadUserData = false;
      })
      .addCase(getInfoUser.rejected, (state) => {
        state.isLoadUserData = false;
      })
      .addCase(getInfoAccoutBank.pending, (state) => {
        state.isLoadInfoAccountBank = true;
      })
      .addCase(getInfoAccoutBank.fulfilled, (state, action) => {
        state.infoAccountBank = action.payload;
        state.isLoadInfoAccountBank = false;
      })
      .addCase(getInfoAccoutBank.rejected, (state) => {
        state.isLoadInfoAccountBank = false;
      });
  },
});

// export const {} = user.actions

export default user.reducer;
