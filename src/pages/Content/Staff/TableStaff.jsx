import { DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Skeleton,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStaff,
  editStaff,
  getListStaff,
} from "../../../services/staff/staff";
import formatDateTime from "../../../utils/dateTime";

import AddStaff from "./AddStaff";
import { getAllListPosition } from "../../../services/position/position";
import { getAllListDepartments } from "../../../services/department/department";
import { getListUserMachine } from "../../../services/timekeeping/timekeeping";
import EditStaff from "./EditStaff";
import { setHasFetchData } from "../../../redux/hasFetchData/hasFetchData";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";
import { getListMiniDashboardEmployees } from "../../../services/miniDashboard/miniDashboard";
export default function TableStaff() {
  const [form] = Form.useForm();
  const { listStaff, isLoadStaff } = useSelector((state) => state.staff);
  const { listMiniDashboardEmployees } = useSelector(
    (state) => state.miniDashboard
  );
  const { fetchData } = useSelector((state) => state.hasFetchData);
  const { allListStores, isLoadStoresAll } = useSelector(
    (state) => state.stores
  );
  const { allListPositions, isLoadingAllPositions } = useSelector(
    (state) => state.position
  );
  const { listUserMachine, isLoadListUserMachine } = useSelector(
    (state) => state.timekeeping
  );
  const { allListDepartments, isLoadAllDepartments } = useSelector(
    (state) => state.departments
  );
  const optionsDepartMent = allListDepartments?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const optionsStore = allListStores?.data?.map((item) => {
    return {
      label: item.store_name,
      value: item.id,
    };
  });
  const optionsPosition = allListPositions?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const optionsAccountTimekeeping = listUserMachine?.data?.map((item) => {
    return {
      label: item.m_username,
      value: item.id,
    };
  });
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  useEffect(() => {
    const callApi = async () => {
      dispatch(setHasFetchData(true));
      await Promise.all[
        (dispatch(getAllListPosition()),
        dispatch(getAllListDepartments()),
        dispatch(getListUserMachine()))
      ];
    };
    if (!fetchData) {
      callApi();
    }
  }, [fetchData, dispatch]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListStaff({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListMiniDashboardEmployees({ currentPage, pageSize }));
    };
    fetchData();
  }, []);
  useEffect(() => {
    const dataNew = listStaff?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        name: items?.name,
        phone: items?.phone,
        birth_day: items?.birth_day,
        store_id: items?.store_id,
        position_id: items?.position_id,
        department_id: items?.department_id,
        position: items?.position?.name,
        department: items?.department?.name,
        cccd: items?.cccd,
        is_active: items?.is_active,
        total_salary: items?.total_salary,
        total_maintenance: items?.total_maintenance,
        total_motor: items?.total_motor,
        total_customer: items?.total_customer,
        total_wage: items?.total_wage,
        created_at: items.created_at,
        end_user_machine_id: items?.end_user_machine_id,
      };
    });
    setData(dataNew);
  }, [listStaff]);
  const handleDelete = async (record) => {
    try {
      const response = await dispatch(deleteStaff(record.id));
      if (deleteStaff.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await dispatch(
          getListMiniDashboardEmployees({ currentPage, pageSize })
        );
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          await dispatch(getListStaff({ currentPage, pageSize }));
        }
      } else if (deleteStaff.rejected.match(response)) {
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
      if (response.payload.message) {
        message.error(response.payload.message);
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };
  const onChangeSwitch = (checked, record) => {
    try {
      const dataIndex = data.findIndex((item) => item.key === record.key);
      if (dataIndex !== -1) {
        const updatedData = [...data];
        updatedData[dataIndex].is_active = checked;
        setData(updatedData);
        store.dispatch(editStaff(updatedData[dataIndex]));
        message.success("Thay đổi trạng thái thành công");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thay đổi trạng thái");
    }
  };
  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      // editable: true,
      width: "11%",
      render: (_, record) => {
        const title = (
          <>
            <p>Doanh số : {record.total_salary} VNĐ</p>
            <p>Số xe bảo dưỡng : {record.total_maintenance}</p>
            <p>Số xe sửa chữa : {record.total_motor}</p>
            <p>Số lượt khách đã tiếp : {record.total_customer}</p>
          </>
        );

        return (
          <Tooltip className="config-hover" title={title}>
            {record.name}
          </Tooltip>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      // editable: true,
      width: "11%",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_day",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Căn cước công dân",
      dataIndex: "cccd",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Bộ phận",
      dataIndex: "department",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Chức vụ ",
      dataIndex: "position",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Trạng thái ",
      dataIndex: "is_active",
      align: "center",
      width: "11%",
      render: (_, record) => (
        <Switch
          onChange={() => onChangeSwitch(!record.is_active, record)}
          checked={record.is_active}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "11%",
      // editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    {
      title: "Sửa/Xóa",
      dataIndex: "operation",
      align: "center",
      width: "11%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditStaff
              record={record}
              optionsDepartMent={optionsDepartMent}
              optionsStore={optionsStore}
              optionsPosition={optionsPosition}
              optionsAccountTimekeeping={optionsAccountTimekeeping}
              isLoadAccountTimekeeping={isLoadListUserMachine}
              isLoadStoresAll={isLoadStoresAll}
              isLoadingAllPositions={isLoadingAllPositions}
              isLoadAllDepartments={isLoadAllDepartments}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
            />
            <Tooltip placement="leftTop" title="Xóa">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteOutlined style={{ color: "#f5222d", fontSize: 20 }} />
              </Popconfirm>
            </Tooltip>
          </Flex>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable || col.dataIndex === "operation") {
      return col;
    }
    return {
      ...col,
      render: (_, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleShowEdit(record)}
        >
          {col.render ? col.render(_, record) : record[col.dataIndex]}
        </div>
      ),
    };
  });
  const [inputValue, setInputValue] = useState("");
  const delayedSearch = useRef(
    debounce((value) => {
      store.dispatch(getListStaff({ currentPage, pageSize, value }));
    }, 600)
  ).current;
  const handleInputChange = useCallback(
    (event) => {
      let value = event.target.value;
      setInputValue(value);
      delayedSearch(value);
    },
    [delayedSearch]
  );
  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Nhân sự",
          },
          {
            title: "Nhân viên",
            href: "/staff",
          },
        ]}
      />

      <Row gutter={[16, 16]} justify="center">
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <TeamOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số nhân sự hiện tại</p>
              <p className="metric-value">
                {listMiniDashboardEmployees?.data?.cntEmployeeActive || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <TeamOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số nhân sự đang làm việc</p>
              <p className="metric-value">
                {listMiniDashboardEmployees?.data?.cntEmployeeTimekeeping || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <TeamOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số nhân sự đang nghỉ hôm nay</p>
              <p className="metric-value">
                {listMiniDashboardEmployees?.data?.cntEmployeeLeave || 0}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Divider />
      <Row gutter={[12, 12]}>
        <Col xl lg md sm>
          <AddStaff
            currentPage={currentPage}
            pageSize={pageSize}
            optionsDepartMent={optionsDepartMent}
            optionsStore={optionsStore}
            optionsPosition={optionsPosition}
            optionsAccountTimekeeping={optionsAccountTimekeeping}
            isLoadAccountTimekeeping={isLoadListUserMachine}
            isLoadStoresAll={isLoadStoresAll}
            isLoadingAllPositions={isLoadingAllPositions}
            isLoadAllDepartments={isLoadAllDepartments}
          />
        </Col>
        <Col xl lg md sm>
          <Input
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          />
        </Col>
      </Row>
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listStaff?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadStaff : false}
          dataSource={isLoadStaff ? [] : data}
          locale={{
            emptyText: isLoadStaff ? (
              <Flex vertical gap={20}>
                {[...Array(data?.length || 0)].map((_, rowIndex) => (
                  <Flex gap={10} justify="space-between" key={rowIndex}>
                    {columns.map((column) => (
                      <Skeleton.Input
                        key={`${column.dataIndex}-${rowIndex}`}
                        active={true}
                        size="small"
                        style={{ width: "90%" }}
                      />
                    ))}
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Empty />
            ),
          }}
          bordered
          scroll={{ x: 1000, y: 520 }}
        />
      </Form>
    </div>
  );
}
