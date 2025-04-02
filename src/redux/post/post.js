import { createSlice } from "@reduxjs/toolkit";
import {
  getListPost,
  getDetailPost,
  getListCategoryPost,
} from "../../services/post/post";

const initialState = {
  listPost: null,
  isLoadPost: false,
  detailPost: null,
  isLoadDetailPost: false,
  listStaffRequest: null,
  isLoadListStaffRequest: false,
  listPostCheckActive: null,
  isLoadListPostCheckActive: false,
  listCategoryPost: null,
  isLoadListCategoryPost: false,
  listDayOffSetting: null,
  isLoadListDayOffSetting: false,
  listAllEmployee: null,
  isLoadEmployee: false,
  listUserMachine: null,
  isLoadListUserMachine: false,
};

const post = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListPost.pending, (state) => {
        state.isLoadPost = true;
      })
      .addCase(getListPost.fulfilled, (state, action) => {
        state.listPost = action.payload;
        state.isLoadPost = false;
      })
      .addCase(getListPost.rejected, (state) => {
        state.isLoadPost = false;
      })
      .addCase(getDetailPost.pending, (state) => {
        state.isLoadDetailPost = true;
      })
      .addCase(getDetailPost.fulfilled, (state, action) => {
        state.detailPost = action.payload.data;
        state.isLoadDetailPost = false;
      })
      .addCase(getDetailPost.rejected, (state) => {
        state.isLoadDetailPost = false;
      })
      .addCase(getListCategoryPost.pending, (state) => {
        state.isLoadListCategoryPost = true;
      })
      .addCase(getListCategoryPost.fulfilled, (state, action) => {
        state.listCategoryPost = action.payload.data;
        state.isLoadListCategoryPost = false;
      })
      .addCase(getListCategoryPost.rejected, (state) => {
        state.isLoadListCategoryPost = false;
      });
  },
});

// export const {} = post.actions;

export default post.reducer;
