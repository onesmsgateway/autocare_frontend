import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListMaintenanceDebt = createAsyncThunk(
    "maintenanceDebt/getListMaintenanceDebt",
    async ({ currentPage, pageSize, status, search }) => {
        try {
            let apiUrl = `/company/api/v1/maintenance-debts?has_paginate&size=${pageSize}&page=${currentPage}`;
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

export const getDetailMaintenanceDebt = createAsyncThunk(
    "maintenanceDebt/getDetailMaintenanceDebt",
    async (id) => {
        try {
            let apiUrl = `/company/api/v1/maintenance-debts/${id}`;
            const response = await http.get(apiUrl);
            // console.log(response)
            return response.data;
        } catch (error) {
            throw new Error("Có lỗi xảy ra trong quá trình kết nối");
        }
    }
);

export const editMaintenanceDebt = createAsyncThunk(
    "maintenanceDebt/editMaintenanceDebt",
    async (data, { rejectWithValue }) => {
        try {
            const response = await http.put(
                `/company/api/v1/maintenance-debts/${data.id}`,
                data
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
