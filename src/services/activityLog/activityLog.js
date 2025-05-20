import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListActivityLogs = createAsyncThunk(
    "activityLog/getListActivityLogs",
    async ({ currentPage, pageSize, model, search, action }) => {
      try {
        // Sử dụng URLSearchParams để xây dựng URL động và an toàn
        const searchParams = new URLSearchParams({
          has_paginate: 'true',
          size: String(pageSize),
          page: String(currentPage)
        });
  
        // Thêm các tham số tùy chọn một cách có điều kiện
        if (model) {
          searchParams.append('model', model);
        }
  
        if (search && action) {
          searchParams.append('search', search);
          searchParams.append('action', action);
        } else if (search) {
          searchParams.append('search', search);
        } else if (action) {
          searchParams.append('action', action);
        }
  
        // Xây dựng URL cuối cùng
        const apiUrl = `/company/api/v1/workshop/activity-logs?${searchParams.toString()}`;
  
        // Gọi API
        const response = await http.get(apiUrl);
        return response.data;
      } catch (error) {
        // Xử lý lỗi chi tiết hơn
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Có lỗi xảy ra trong quá trình kết nối";
        
        throw new Error(errorMessage);
      }
    }
  );
  
  

export const getDetailActivityLog = createAsyncThunk(
  "activityLog/getDetailActivityLog",
  async (id) => {
    try {
      let apiUrl = `/company/api/v1/workshop/activity-logs/${id}`;

      const response = await http.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

