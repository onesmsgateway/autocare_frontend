import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListPost = createAsyncThunk(
  "post/getListPost",
  async ({
    currentPage,
    pageSize,
    // month,
    // year,
    // company_id,
    search,
    status,
  }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/posts?size=${pageSize}&page=${currentPage}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      // console.log(apiUrl);
      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getDetailPost = createAsyncThunk(
  "timekeeping/getDetailPost",
  async ({ id, month, year, company_id, search, status }) => {
    // console.log({ currentPage, pageSize,value,branchId })
    try {
      let apiUrl = `/api/v1/timekeeping/record/${id}?month=${month}&year=${year}&company_id=${company_id}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/api/v1/timekeeping/posts`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePost = createAsyncThunk(
  "timekeeping/updatePost",
  async (data, { rejectWithValue }) => {
    try {
      const {
        id,
        post_category_id,
        title,
        summary,
        content,
        image,
        target,
        status,
      } = data;
      const response = await http.put(`/api/v1/timekeeping/posts/${id}`, {
        post_category_id,
        title,
        summary,
        content,
        image,
        target,
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStatusPost = createAsyncThunk(
  "post/updateStatusPost",
  async (data, { rejectWithValue }) => {
    try {
      const { id, status } = data;
      const response = await http.put(
        `/api/v1/timekeeping/posts/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/api/v1/timekeeping/posts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListCategoryPost = createAsyncThunk(
  "post/getListCategoryPost",
  async ({ currentPage, pageSize, search, status }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/post-categories?size=${pageSize}&page=${currentPage}`;
      // let apiUrl = `/api/v1/timekeeping/leaves?company_id=${company_id}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      // console.log("apiUrl", apiUrl);
      const response = await http.get(apiUrl);

      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createCategoryPost = createAsyncThunk(
  "post/createCategoryPost",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/v1/timekeeping/post-categories`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategoryPost = createAsyncThunk(
  "post/updateCategoryPost",
  async (data, { rejectWithValue }) => {
    try {
      const { id, name, description } = data;
      const response = await http.put(
        `/api/v1/timekeeping/post-categories/${id}`,
        {
          name,
          description,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStatusCategoryPost = createAsyncThunk(
  "post/updateStatusCategoryPost",
  async (data, { rejectWithValue }) => {
    try {
      const { id, status } = data;
      const response = await http.put(
        `/api/v1/timekeeping/post-categories/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategoryPost = createAsyncThunk(
  "post/deleteCategoryPost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/api/v1/timekeeping/post-categories/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadImageCategoryPost = createAsyncThunk(
  "post/uploadImageCategoryPost",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/v1/timekeeping/posts/upload-image`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
