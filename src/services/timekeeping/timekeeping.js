import { createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../utils/config";

export const getListTimekeeping = createAsyncThunk(
  "timekeeping/getListTimekeeping",
  async ({
    currentPage,
    pageSize,
    month,
    year,
    company_id,
    search,
    status,
  }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/record/list?has_paginate&size=${pageSize}&page=${currentPage}&month=${month}&year=${year}&company_id=${company_id}`;
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

export const getDetailTimekeeping = createAsyncThunk(
  "timekeeping/getDetailTimekeeping",
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

export const getListStaffRequest = createAsyncThunk(
  "timekeeping/getListStaffRequest",
  async ({
    currentPage,
    pageSize,
    month,
    year,
    company_id,
    search,
    status,
  }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/leaves?has_paginate&size=${pageSize}&page=${currentPage}&month=${month}&year=${year}&company_id=${company_id}`;
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

export const updateStatusStaffRequest = createAsyncThunk(
  "timekeeping/updateStatusStaffRequest",
  async (data, { rejectWithValue }) => {
    try {
      const { id, status_accept } = data;
      const response = await http.post(
        `/api/v1/timekeeping/leaves/${id}/accept`,
        { status_accept }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getWorkDays = createAsyncThunk(
  "timekeeping/getWorkDays",
  async ({ company_id, type, target_id }) => {
    try {
      let apiUrl = `/api/v1/timekeeping/work-days?company_id=${company_id}&target_id=${target_id}`;
      if (type) {
        apiUrl += `&type=${type}`;
      }
      const response = await http.get(apiUrl);
      // console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const updateWorkDays = createAsyncThunk(
  "timekeeping/updateWorkDays",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/v1/timekeeping/work-days/create-or-update`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListLeaveTypeSetting = createAsyncThunk(
  "timekeeping/getListLeaveTypeSetting",
  async ({ currentPage, pageSize, company_id, search, status }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/leave-time-types?company_id=${company_id}`;
      // let apiUrl = `/api/v1/timekeeping/leaves?company_id=${company_id}`;
      if (search && status) {
        apiUrl += `&search=${search}&status=${status}`;
      } else if (search) {
        apiUrl += `&search=${search}`;
      } else if (status) {
        apiUrl += `&status=${status}`;
      }
      if (pageSize && currentPage) {
        apiUrl += `&size=${pageSize}&page=${currentPage}`;
      }
      // console.log("apiUrl", apiUrl);
      const response = await http.get(apiUrl);

      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const createLeaveType = createAsyncThunk(
  "timekeeping/createLeaveType",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/v1/timekeeping/leave-time-types/create`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLeaveType = createAsyncThunk(
  "timekeeping/updateLeaveType",
  async (data, { rejectWithValue }) => {
    try {
      const { id, name, description, company_id } = data;
      const response = await http.put(
        `/api/v1/timekeeping/leave-time-types/${id}`,
        {
          name,
          description,
          company_id,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStatusLeaveType = createAsyncThunk(
  "timekeeping/updateStatusLeaveType",
  async (data, { rejectWithValue }) => {
    try {
      const { id, status } = data;
      const response = await http.put(
        `/api/v1/timekeeping/leave-time-types/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLeaveType = createAsyncThunk(
  "timekeeping/deleteLeaveType",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/api/v1/timekeeping/leave-time-types/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListDayOffSetting = createAsyncThunk(
  "timekeeping/getListDayOffSetting",
  async ({ currentPage, pageSize, company_id, search, status }) => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/dayoff?has_paginate&size=${pageSize}&page=${currentPage}&company_id=${company_id}`;
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

export const createDayOff = createAsyncThunk(
  "timekeeping/createDayOff",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(`/api/v1/timekeeping/dayoff`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDayOff = createAsyncThunk(
  "timekeeping/updateDayOff",
  async (data, { rejectWithValue }) => {
    try {
      const { id, employee_id, leave_type_id, stock } = data;
      const response = await http.put(`/api/v1/timekeeping/dayoff/${id}`, {
        employee_id,
        leave_type_id,
        stock,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDayOff = createAsyncThunk(
  "timekeeping/deleteDayOff",
  async (id, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/api/v1/timekeeping/dayoff/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListAllEmployee = createAsyncThunk(
  "timekeeping/getListEmployee",
  async () => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/employees`;
      const response = await http.get(apiUrl);

      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const getGPS = createAsyncThunk("timekeeping/getGPS", async () => {
  // console.log({ currentPage, pageSize,value,branchId })
  try {
    let apiUrl = `/api/v1/timekeeping/gps`;
    const response = await http.get(apiUrl);
    // console.log(response)
    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra trong quá trình kết nối");
  }
});

export const updateGPS = createAsyncThunk(
  "timekeeping/updateGPS",
  async (data, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/v1/timekeeping/gps/create-or-update`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getListUserMachine = createAsyncThunk(
  "timekeeping/getListUserMachine",
  async () => {
    // console.log({ currentPage, pageSize,search,status })
    try {
      let apiUrl = `/api/v1/timekeeping/user/list`;
      const response = await http.get(apiUrl);

      return response.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra trong quá trình kết nối");
    }
  }
);

export const updateNote = createAsyncThunk(
  "timekeeping/updaetNoteTimekeeping",
  async (data, { rejectWithValue }) => {
    try {
      const { id, note } = data;
      let apiUrl = `/api/v1/timekeeping/record/${id}/update-note`;
      const response = await http.put(apiUrl,
        {
          note
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
