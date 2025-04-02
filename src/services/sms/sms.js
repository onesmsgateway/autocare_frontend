import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListSms = createAsyncThunk(
  "sms/getListSms",
  async ({ currentPage, pageSize,value,branchId }) => {
    try {
      let apiUrl = `/sms/api/v1/getsms?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (value && branchId) {
        apiUrl += `&search=${value}&branch_first_id=${branchId}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (branchId) {
        // Nếu chỉ có branchId
        apiUrl += `&branch_first_id=${branchId}`;
      }
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const sentSms = createAsyncThunk(
  "sms/sentSms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/send-sms-customer`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Đặt lịch nhắn tin 
export const getListScheduleSms = createAsyncThunk(
  "sms/getListScheduleSms",
  async ({ currentPage, pageSize,value,branchId }) => {
    try {
      let apiUrl = `/sms/api/v1/sms-schedule?has_paginate&size=${pageSize}&page=${currentPage}`;
      if (value && branchId) {
        apiUrl += `&search=${value}&branch_first_id=${branchId}`;
      } else if (value) {
        // Nếu chỉ có giá trị tìm kiếm
        apiUrl += `&search=${value}`;
      } else if (branchId) {
        // Nếu chỉ có branchId
        apiUrl += `&branch_first_id=${branchId}`;
      }
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createScheduleSms = createAsyncThunk(
  "sms/createScheduleSms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/sms-schedule`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editScheduleSms = createAsyncThunk(
  "sms/editScheduleSms",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.put(`/sms/api/v1/sms-schedule/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteScheduleSms = createAsyncThunk(
  "sms/deleteScheduleSms",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/sms/api/v1/sms-schedule/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Cấu hình tin nhắn sinh nhật
export const getListConfigSmsBirthday = createAsyncThunk(
  "sms/getListConfigSmsBirthday",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-birthday-config`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const configSmsBirthday = createAsyncThunk(
  "sms/configSmsBirthday",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/sms-birthday-config`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Cấu hình tin nhắn bảo dưỡng dịch vụ
export const getListServiceMaintenance = createAsyncThunk(
  "sms/getListServiceMaintenance",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-caring-config`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const serviceMaintenance = createAsyncThunk(
  "sms/serviceMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/sms-caring-config`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Cấu hình thay dầu theo số KM
export const getListChangOilKm = createAsyncThunk(
  "sms/getListChangOilKm",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-changeoil-config`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const changOilKm = createAsyncThunk(
  "sms/changOilKm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-changeoil-config`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Cấu hình tin nhắn bảo dưỡng định kì
export const getListPeriodicMaintenance = createAsyncThunk(
  "sms/getListPeriodicMaintenance",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-config-periodic-maintenance`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const periodicMaintenance = createAsyncThunk(
  "sms/periodicMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-config-periodic-maintenance`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Nhắn tin cảm ơn mua xe
export const getListThankYouBuyCar = createAsyncThunk(
  "sms/getListThankYouBuyCar",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-config-thank-buy`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const thankYouBuyCar = createAsyncThunk(
  "sms/thankYouBuyCar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-config-thank-buy`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Bảo dưỡng định kì toàn bộ
export const getListPeriodicMaintenanceAll = createAsyncThunk(
  "sms/getListPeriodicMaintenanceAll",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-config-periodic-maintenance-all`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const periodicMaintenanceAll = createAsyncThunk(
  "sms/periodicMaintenanceAll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-config-periodic-maintenance-all`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Nhắn tin bảo dưỡng theo từng loại bảo dưỡng
export const getListConfigTypeMaintenance = createAsyncThunk(
  "sms/getListConfigTypeMaintenance",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-config-light-heavy-maintenance`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const configTypeMaintenance = createAsyncThunk(
  "sms/configTypeMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-config-light-heavy-maintenance`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Nhắn tin thay dầu theo thời gian
export const getListChangeOilTime = createAsyncThunk(
  "sms/getListChangeOilTime",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-changeoil-overtime-config`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const changeOilTime = createAsyncThunk(
  "sms/changeOilTime",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-changeoil-overtime-config`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Nhắn tin cảm ơn bảo dưỡng
export const getListThankyouMaintenance = createAsyncThunk(
  "sms/getListThankyouMaintenance",
  async () => {
    try {
      let apiUrl = `/sms/api/v1/sms-thank-caring-config`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const thankyouMaintenance = createAsyncThunk(
  "sms/thankyouMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/sms/api/v1/sms-thank-caring-config`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Các tin nhắn khác
export const getListConfigSmsOther = createAsyncThunk(
  "sms/getListConfigSmsOther",
  async (type) => {
    try {
      let apiUrl = `/sms/api/v1/sms-orther-config?type=${type}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const configSmsOther = createAsyncThunk(
  "sms/configSmsOther",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/sms-orther-config`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getListTemplateSms = createAsyncThunk(
  "sms/getListTemplateSms",
  async ({ currentPage, pageSize }) => {
    try {
      let apiUrl = `/sms/api/v1/sms-sample?has_paginate&size=${pageSize}&page=${currentPage}`;
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);
export const createTemplateMess = createAsyncThunk(
  "sms/createTemplateMess",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/sms/api/v1/sms-sample`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteTemplateMess = createAsyncThunk(
  "sms/deleteTemplateMess",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/sms/api/v1/sms-sample/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
