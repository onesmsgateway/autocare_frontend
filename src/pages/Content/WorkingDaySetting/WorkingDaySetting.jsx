import {
  Tabs,
  Breadcrumb,
  Button,
  Col,
  TimePicker,
  Form,
  Row,
  Skeleton,
  message,
  Select,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import {
  getWorkDays,
  updateWorkDays,
} from "../../../services/timekeeping/timekeeping";
import { store } from "../../../redux/configStores";
import { settings } from "../../../utils/config";
import { CloseCircleOutlined } from "@ant-design/icons";
import { getAllListDepartments } from "../../../services/department/department";
import { getAllListStaff, getListStaff } from "../../../services/staff/staff";
import { debounce, values } from "lodash";

dayjs.extend(duration);

export default function WorkingDaySetting() {
  const navigate = useNavigate();
  const [formAdd] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [morningShift, setMorningShift] = useState([]);
  const [afternoonShift, setAfternoonShift] = useState([]);
  const [workHours, setWorkHours] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const [activeTab, setActiveTab] = useState("company"); // Track the active tab
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const company_id = userData?.data?.company_id || settings.getCookie("company_id");

  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState('');

  const { allListDepartments, isLoadAllDepartments } = useSelector(
    (state) => state.departments
  );

  const { allListStaff, isLoadAllStaff } = useSelector(
    (state) => state.staff
  );

  console.log('selectedStaffs', selectedStaffs);

  console.log('allListDepartments', allListDepartments);

  const optionDepartment = allListDepartments?.data?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });
  console.log('allListStaff', allListStaff);
  const optionStaff = allListStaff?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
      phone: item?.phone,
    };
  });

  console.log('selectAllChecked', selectAllChecked);
  const handleSelectAll = (e) => {
    const allValues = optionStaff.map((item) => item.value);
    if (e.target.checked === true) {
      setSelectedStaffs(allValues);
      setSelectAllChecked(true);
    } else {
      setSelectedStaffs([]);
      setSelectAllChecked(false);
    }
  };

  const handleSearch = debounce((value) => {
    console.log(value);
    if (!value) return;
    try {
      store.dispatch(
        getListStaff({ currentPage: 1, pageSize: pageSizeScroll, value })
      );
    } catch (error) {
      console.error("Error occurred while searching:", error);
    }
  }, 500);

  const onChangeSelect = (value) => {
    setSelectedStaffs(value);
    setSelectAllChecked(false); // Reset select all button
  };

  const fetchData = async (tabType, targetId) => {
    setIsLoading(true);
    try {
      // Add `type` parameter to API request based on active tab
      const response = await store.dispatch(getWorkDays({ company_id, type: tabType, target_id: targetId }));
      const data = response?.payload?.data;
      console.log('data', data);

      if (data && Object.keys(data).length > 0) {
        // Nếu dữ liệu không rỗng, cập nhật dữ liệu cho form và trạng thái
        setExistingData(data);
        formAdd.setFieldsValue({
          check_in: [
            dayjs(data.check_in, "HH:mm:ss"),
            dayjs(data.sleep_in, "HH:mm:ss"),
          ],
          check_out: [
            dayjs(data.sleep_out, "HH:mm:ss"),
            dayjs(data.check_out, "HH:mm:ss"),
          ],
          in_early: data.in_early ? dayjs(data.in_early, "HH:mm:ss") : undefined,
          in_late: data.in_late ? dayjs(data.in_late, "HH:mm:ss") : undefined,
          out_early: data.out_early ? dayjs(data.out_early, "HH:mm:ss") : undefined,
          out_late: data.out_late ? dayjs(data.out_late, "HH:mm:ss") : undefined,
          target_id: data.target_id || null,
          target_type: data.target_type,
          employee_ids: data.employee_ids || []
        });

        setMorningShift([dayjs(data.check_in, "HH:mm:ss"), dayjs(data.sleep_in, "HH:mm:ss")]);
        setAfternoonShift([dayjs(data.sleep_out, "HH:mm:ss"), dayjs(data.check_out, "HH:mm:ss")]);

      } else {
        // Nếu dữ liệu rỗng, có thể thiết lập giá trị mặc định cho form hoặc hiển thị thông báo
        setExistingData({});
        if (selectedDepartment && activeTab === 'department') {
          const fieldToKeep = formAdd.getFieldValue('target_id');
          // Reset toàn bộ form
          formAdd.resetFields();
          // Gán lại giá trị cho trường cần giữ nếu có
          formAdd.setFieldsValue({
            target_id: fieldToKeep,
          });
        } else {
          formAdd.resetFields();
        }
        // Hiển thị thông báo cho người dùng biết không có dữ liệu
        message.warning("Không có dữ liệu cài đặt ngày làm việc.");
      }
    } catch (error) {
      message.error("Không thể lấy dữ liệu cài đặt ngày làm việc");
    } finally {
      setIsLoading(false);
    }
  };


  const calculateWorkHours = () => {
    if (morningShift.length === 2 && afternoonShift.length === 2) {
      const morningDuration = dayjs.duration(morningShift[1].diff(morningShift[0]));
      const afternoonDuration = dayjs.duration(afternoonShift[1].diff(afternoonShift[0]));
      const totalDuration = morningDuration.add(afternoonDuration);
      setWorkHours(totalDuration.format("HH:mm:ss"));
      formAdd.setFieldsValue({ work_hours: totalDuration.format("HH:mm:ss") });
      setDisableSubmit(false);
    } else {
      formAdd.setFieldsValue({ work_hours: undefined });
      setDisableSubmit(true);
    }
  };

  const handleMorningShiftChange = (value) => {
    setMorningShift(value);
    setAfternoonShift([]);
    formAdd.setFieldsValue({ check_out: undefined });
  };

  const handleAfternoonShiftChange = (value) => {
    const morningEnd = morningShift[1];
    if (morningEnd && value[0] && value[0].isBefore(morningEnd)) {
      message.error(
        "Thời gian bắt đầu ca chiều phải lớn hơn hoặc bằng thời gian kết thúc ca sáng."
      );
      setAfternoonShift([]);
      setDisableSubmit(true);
    } else {
      setAfternoonShift(value);
    }
  };

  const handleChangeDepartment = (value) => {
    setSelectedDepartment(value);
  };

  const onFinish = async (fieldsValue) => {
    console.log('fieldsValue', fieldsValue);

    setIsLoading(true);
    try {
      const values = {
        check_in: fieldsValue.check_in[0].format("HH:mm:ss"),
        sleep_in: fieldsValue.check_in[1].format("HH:mm:ss"),
        sleep_out: fieldsValue.check_out[0].format("HH:mm:ss"),
        check_out: fieldsValue.check_out[1].format("HH:mm:ss"),
        work_hours: fieldsValue.work_hours,
        in_early: fieldsValue.in_early?.format("HH:mm:ss"),
        in_late: fieldsValue.in_late?.format("HH:mm:ss"),
        out_early: fieldsValue.out_early?.format("HH:mm:ss"),
        out_late: fieldsValue.out_late?.format("HH:mm:ss"),
        company_id,
        target_type: activeTab || 'company',
        target_id: fieldsValue.target_id || null,
        employee_ids: selectedStaffs || []
      };

      const response = existingData
        ? await store.dispatch(updateWorkDays({ ...values, id: existingData.id }))
        : await store.dispatch(updateWorkDays(values));

      if (updateWorkDays.fulfilled.match(response)) {
        message.success(existingData ? "Cập nhật thành công" : "Tạo mới thành công");
        fetchData(activeTab); // Fetch data again with the current tab type
      } else {
        message.error("Cập nhật không thành công");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu cài đặt");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    await dispatch(getAllListDepartments());
  };

  const fetchStaffs = async () => {
    await dispatch(getAllListStaff());
  };

  useEffect(() => {
    fetchData(activeTab); // Fetch data when the component mounts
    if (activeTab === "department") {
      fetchDepartments();
    } else if (activeTab === "employee") {
      fetchStaffs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "department" && selectedDepartment) {
      fetchData(activeTab, selectedDepartment);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    calculateWorkHours();
  }, [morningShift, afternoonShift]);


  const tabContent = {
    company: (
      <Form
        form={formAdd}
        layout="vertical"
        onFinish={onFinish}
        requiredMark=""
      >
        {isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="check_in"
                  label="Ca sáng"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                  <TimePicker.RangePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    onChange={handleMorningShiftChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="check_out"
                  label="Ca chiều"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                  <TimePicker.RangePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    disabled={morningShift.length === 0}
                    onChange={handleAfternoonShiftChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="in_early"
                  label="Check in sớm (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="in_late"
                  label="Check in muộn (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"
                  />
                </Form.Item>
              </Col>

              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="out_early"
                  label="Check out sớm (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>

              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="out_late"
                  label="Check out muộn (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="work_hours">
              <p>
                Tổng thời gian làm việc:{" "}
                <span style={{ fontWeight: "bold" }}>{workHours}</span>
              </p>
            </Form.Item>
          </>
        )}
        <Button
          type="primary"
          htmlType="submit"
          disabled={disableSubmit}
          loading={isLoading}
        >
          {existingData ? "Cập nhật" : "Lưu"}
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => navigate("/list-timekeeping")}
          icon={<CloseCircleOutlined />}
          style={{ marginLeft: 8 }}
        >
          Hủy
        </Button>
      </Form>
    ),
    employee: (
      <Form
        form={formAdd}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="  "
      >
        {isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <Row>
              <Col span={6}>
                <Form.Item name="employee_ids" label="Chọn nhân viên" required>
                  <div style={{ marginTop: "10px" }}>
                    <Checkbox
                      disabled={optionStaff?.length === 0}
                      onChange={handleSelectAll}
                      checked={selectAllChecked}
                    >
                      Tất cả
                    </Checkbox>
                  </div>
                  <Select
                    allowClear
                    showSearch
                    mode="multiple"
                    maxTagCount="responsive"
                    virtual
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().includes(input.toLowerCase())
                    }
                    onSearch={handleSearch}
                    onClear={() => {
                      store.dispatch(
                        getListStaff()
                      );
                    }}
                    loading={isLoadAllStaff}
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                    // onPopupScroll={handlePopupScroll}
                    onChange={onChangeSelect}
                    value={selectedStaffs}
                  >
                    {optionStaff?.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                    {/* {loadingScroll && (
                      <Option key="loading" disabled>
                        <Skeleton active paragraph={{ rows: 1 }} />
                      </Option>
                    )} */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="check_in"
                  label="Ca sáng"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                  <TimePicker.RangePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    onChange={handleMorningShiftChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="check_out"
                  label="Ca chiều"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                  <TimePicker.RangePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    disabled={morningShift.length === 0}
                    onChange={handleAfternoonShiftChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="in_early"
                  label="Check in sớm (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="in_late"
                  label="Check in muộn (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"
                  />
                </Form.Item>
              </Col>

              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="out_early"
                  label="Check out sớm (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>

              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="out_late"
                  label="Check out muộn (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="work_hours">
              <p>
                Tổng thời gian làm việc:{" "}
                <span style={{ fontWeight: "bold" }}>{workHours}</span>
              </p>
            </Form.Item>
          </>
        )}
        <Button
          type="primary"
          htmlType="submit"
          disabled={disableSubmit}
          loading={isLoading}
        >
          {existingData ? "Cập nhật" : "Lưu"}
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => navigate("/list-timekeeping")}
          icon={<CloseCircleOutlined />}
          style={{ marginLeft: 8 }}
        >
          Hủy
        </Button>
      </Form>
    ),
    department: (
      <Form
        form={formAdd}
        layout="vertical"
        onFinish={onFinish}
        requiredMark=""
      >
        {isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <Row>
              <Col xl lg md sm>
                <Form.Item
                  name="target_id"
                  label="Chọn phòng ban"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phòng ban",
                    },
                  ]}
                >
                  <Select
                    style={{ width: 200 }}
                    value={selectedDepartment || undefined}
                    onChange={handleChangeDepartment}
                    options={optionDepartment} // Gán các option đã tạo vào Select
                    loading={isLoadAllDepartments} // Hiển thị loading nếu đang tải dữ liệu
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="check_in"
                  label="Ca sáng"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                  <TimePicker.RangePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    onChange={handleMorningShiftChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="check_out"
                  label="Ca chiều"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
                  <TimePicker.RangePicker
                    style={{ width: "100%" }}
                    format="HH:mm"
                    disabled={morningShift.length === 0}
                    onChange={handleAfternoonShiftChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="in_early"
                  label="Check in sớm (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>
              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="in_late"
                  label="Check in muộn (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"
                  />
                </Form.Item>
              </Col>

              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="out_early"
                  label="Check out sớm (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>

              <Col xl={6} lg={6} md={6} sm>
                <Form.Item
                  name="out_late"
                  label="Check out muộn (phút)"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn thời gian",
                    },
                  ]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    showNow={false}
                    format="mm"

                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="work_hours">
              <p>
                Tổng thời gian làm việc:{" "}
                <span style={{ fontWeight: "bold" }}>{workHours}</span>
              </p>
            </Form.Item>
          </>
        )}
        <Button
          type="primary"
          htmlType="submit"
          disabled={disableSubmit}
          loading={isLoading}
        >
          {existingData ? "Cập nhật" : "Lưu"}
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => navigate("/list-timekeeping")}
          icon={<CloseCircleOutlined />}
          style={{ marginLeft: 8 }}
        >
          Hủy
        </Button>
      </Form>
    ),
  };

  return (
    <div className="working-day-setting">
      <h2>{"Cài đặt ngày làm việc"}</h2>
      <Breadcrumb
        separator=">"
        items={[
          { title: "Home", href: "/" },
          { title: "Chấm công", href: "/list-timekeeping" },
          { title: "Cài đặt ngày làm việc" },
        ]}
      />
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)} // Update activeTab on tab change
        items={[
          { key: "company", label: "Công ty", children: tabContent.company },
          { key: "employee", label: "Nhân viên", children: tabContent.employee },
          { key: "department", label: "Phòng ban", children: tabContent.department },
        ]}
      />
    </div>
  );
}
