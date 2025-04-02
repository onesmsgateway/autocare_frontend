import {
  Breadcrumb,
  Col,
  DatePicker,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Skeleton,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConvertStatus, formatDate } from "../../../utils/dateTime";

import { getAllListPosition } from "../../../services/position/position";
import { getAllListDepartments } from "../../../services/department/department";
import { setHasFetchData } from "../../../redux/hasFetchData/hasFetchData";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";
import {
  getListStaffRequest,
  updateStatusStaffRequest,
} from "../../../services/timekeeping/timekeeping";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { settings } from "../../../utils/config";

const items = [
  {
    key: "",
    label: "Tất cả",
  },
  {
    key: "pending",
    label: "Chưa xử lý",
  },
  {
    key: "approved",
    label: "Đã chấp thuận",
  },
  {
    key: "rejected",
    label: "Đã từ chối",
  },
];

export default function TableStaffRequest() {
  const { listStaffRequest, isLoadListStaffRequest } = useSelector(
    (state) => state.timekeeping
  );
  const { fetchData } = useSelector((state) => state.hasFetchData);
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [filters, setFilters] = useState("");
  const company_id =
    userData?.data?.company_id || settings?.getCookie("company_id");
  const [inputValue, setInputValue] = useState("");

  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const delayedAction = useRef(
    debounce((value, date, filters) => {
      const month = date.month() + 1;
      const year = date.year();
      store.dispatch(
        getListStaffRequest({
          currentPage,
          pageSize,
          month,
          year,
          company_id,
          search: value,
          status: filters,
        })
      );
    }, 600)
  ).current;

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      delayedAction(value, selectedDate, filters);
    },
    [delayedAction, selectedDate, filters]
  );

  const handleDateChange = useCallback(
    (date) => {
      if (date) {
        setSelectedDate(date);
        delayedAction(inputValue, date, filters);
      }
    },
    [delayedAction, inputValue, filters]
  );

  const handleStatusChange = useCallback(
    (status) => {
      setFilters(status);
      delayedAction(inputValue, selectedDate, status);
    },
    [delayedAction, inputValue, selectedDate]
  );

  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };

  const handleUpdate = async (id, status_accept) => {
    const dataUpdate = {
      id,
      status_accept,
    };
    try {
      const response = await store.dispatch(
        updateStatusStaffRequest(dataUpdate)
      );
      if (updateStatusStaffRequest.fulfilled.match(response)) {
        message.success("Cập nhật thành công");
        await dispatch(
          getListStaffRequest({
            currentPage,
            pageSize,
            month: dayjs().month() + 1,
            year: dayjs().year(),
            search: inputValue,
            company_id,
            status: filters,
          })
        );
      } else if (updateStatusStaffRequest.rejected.match(response)) {
        if (response.payload.error) {
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "employee_id",
      align: "center",
      // editable: true,
      width: "10%",
    },
    {
      title: "Tên nhân viên",
      // editable: true,
      width: "12%",
      render: (record) => {
        const name = record?.employee?.name;
        return name;
      },
    },
    {
      title: "Bộ phận",
      align: "center",
      // editable: true,
      width: "11%",
      render: (record) => {
        const department = record?.employee?.department?.name;
        return department;
      },
    },
    {
      title: "Chức vụ ",
      align: "center",
      // editable: true,
      width: "11%",
      render: (record) => {
        const position = record?.employee?.position?.name;
        return position;
      },
    },

    {
      title: "Nghỉ từ ngày",
      dataIndex: "start_date",
      align: "center",
      width: "11%",
      // editable: true,
      render: (record) => {
        const time = formatDate(record);
        return time;
      },
    },
    {
      title: "Nghỉ đến ngày",
      dataIndex: "end_date",
      align: "center",
      width: "11%",
      // editable: true,
      render: (record) => {
        const time = formatDate(record);
        return time;
      },
    },
    {
      title: "Lý do nghỉ ",
      // dataIndex: "position",
      align: "center",
      // editable: true,
      width: "11%",
      render: (record) => {
        const text = record?.leave_type?.name;
        return text;
      },
    },
    {
      title: "Mô tả ",
      dataIndex: "description",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Trạng thái ",
      dataIndex: "status",
      align: "center",
      width: "11%",
      render: (record) => {
        const text = ConvertStatus(record);
        return text;
      },
    },
    {
      title: "Action",
      align: "center",
      width: "11%",
      render: (record) => {
        return (
          <Flex align="between" justify="center" gap={20}>
            {record.status === "pending" && (
              <>
                <Popconfirm
                  placement="leftTop"
                  title="Bạn có chắc chắn muốn duyệt không?"
                  onConfirm={() => handleUpdate(record.id, "approved")}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <CheckOutlined style={{ color: "#0000ff", fontSize: 20 }} />
                </Popconfirm>

                <Tooltip placement="leftTop" title="hủy">
                  <Popconfirm
                    placement="leftTop"
                    title="Bạn có chắc chắn muốn hủy không?"
                    onConfirm={() => handleUpdate(record.id, "rejected")}
                    okText="Xác nhận"
                    cancelText="Hủy"
                  >
                    <CloseOutlined style={{ color: "#f5222d", fontSize: 20 }} />
                  </Popconfirm>
                </Tooltip>
              </>
            )}
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

  useEffect(() => {
    const callApi = async () => {
      dispatch(setHasFetchData(true));
      await Promise.all[
        (dispatch(getAllListPosition()), dispatch(getAllListDepartments()))
      ];
    };
    if (!fetchData) {
      callApi();
    }
  }, [fetchData, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getListStaffRequest({
          currentPage,
          pageSize,
          month: dayjs().month() + 1,
          year: dayjs().year(),
          company_id,
        })
      );
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listStaffRequest?.data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        employee_id: item?.employee_id,
        employee: item?.employee,
        leave_type_id: item?.leave_type_id,
        leave_type: item?.leave_type,
        company_id: item?.company_id,
        start_date: item?.start_date,
        end_date: item?.end_date,
        status: item?.status,
        description: item?.description,
        created_at: item?.created_at,
        updated_at: item?.updated_at,
      };
    });
    setData(dataNew);
  }, [listStaffRequest]);
  return (
    <div>
      <h2>Danh sách yêu cầu nghỉ</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Chấm công",
          },
          {
            title: "Danh sách yêu cầu nghỉ",
            href: "/list-request",
          },
        ]}
      />

      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <Input
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          />
        </Col>
        <Col xl lg md sm>
          <DatePicker
            onChange={handleDateChange}
            picker="month"
            value={selectedDate}
            format="MM/YYYY"
            allowClear={false}
          />
        </Col>
      </Row>
      <Tabs activeKey={filters} items={items} onChange={handleStatusChange} />

      <Form form={form} component={false}>
        {isLoading ? (
          <Skeleton active paragraph />
        ) : (
          <Table
            columns={mergedColumns}
            pagination={{
              showTotal: (total, range) =>
                `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
              showQuickJumper: true,
              showSizeChanger: true,
              onShowSizeChange: handleSizeChange,
              total: listStaffRequest?.total,
              current: currentPage,
              onChange: handlePageChange,
              pageSizeOptions: [10, 20, 30],
            }}
            loading={data?.length === 0 ? isLoadListStaffRequest : false}
            dataSource={isLoadListStaffRequest ? [] : data}
            locale={{
              emptyText: isLoadListStaffRequest ? (
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
        )}
      </Form>
    </div>
  );
}
