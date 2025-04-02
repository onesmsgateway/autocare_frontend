import {
  Breadcrumb,
  Col,
  DatePicker,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Skeleton,
  Table,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListTimekeeping } from "../../../services/timekeeping/timekeeping";
import dayjs from "dayjs";
// import { getAllListPosition } from "../../../services/position/position";
// import { getAllListDepartments } from "../../../services/department/department";
// import { setHasFetchData } from "../../../redux/hasFetchData/hasFetchData";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";
import { NavLink } from "react-router-dom";
import { getListMiniDashboardTimekeeping } from "../../../services/miniDashboard/miniDashboard";
import { DashboardOutlined, TableOutlined } from "@ant-design/icons";
import { settings } from "../../../utils/config";

export default function TableTimekeeping() {
  const { listTimekeeping, isLoadTimekeeping } = useSelector(
    (state) => state.timekeeping
  );
  const { listMiniDashboardTimekeeping } = useSelector(
    (state) => state.miniDashboard
  );
  // const { fetchData } = useSelector((state) => state.hasFetchData);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { userData } = useSelector((state) => state.user);
  const company_id =
    userData?.data?.company_id || settings?.getCookie("company_id");
  const [inputValue, setInputValue] = useState("");

  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "employee_id",
      align: "center",
      width: "6%",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      width: "11%",
    },
    {
      title: "Bộ phận",
      dataIndex: "department",
      align: "center",
      width: "11%",
    },
    {
      title: "Chức vụ ",
      dataIndex: "position",
      align: "center",
      width: "11%",
    },
    {
      title: "Tổng số công trong tháng",
      dataIndex: "total_working",
      align: "center",
      width: "11%",
    },
    {
      title: "Ngày Nghỉ lễ",
      dataIndex: "total_holidays",
      align: "center",
      width: "11%",
    },
    {
      title: "Ngày nghỉ phép",
      dataIndex: "total_leave_days",
      align: "center",
      width: "11%",
    },
    {
      title: "Ngày nghỉ không lương",
      dataIndex: "total_unpaid_leave",
      align: "center",
      width: "11%",
    },
    {
      title: "Xem chi tiết",
      align: "center",
      width: "11%",
      render: (record) => {
        return (
          <NavLink to={`/detail-timekeeping/${record.employee_id}`}>
            Chi tiết
          </NavLink>
        );
      },
    },
  ];

  const delayedAction = useRef(
    debounce((value, date) => {
      const month = date.month() + 1;
      const year = date.year();
      store.dispatch(
        getListTimekeeping({
          currentPage,
          pageSize,
          month,
          year,
          company_id,
          search: value,
        })
      );
      store.dispatch(
        getListMiniDashboardTimekeeping({
          currentPage,
          pageSize,
          company_id,
          time_period: "month",
          month,
          year,
        })
      );
    }, 600)
  ).current;

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      delayedAction(value, selectedDate);
    },
    [delayedAction, selectedDate]
  );

  const handleDateChange = useCallback(
    (date) => {
      if (date) {
        setSelectedDate(date);
        delayedAction(inputValue, date);
      }
    },
    [delayedAction, inputValue]
  );

  // useEffect(() => {
  //   const callApi = async () => {
  //     dispatch(setHasFetchData(true));
  //     await Promise.all[
  //       (dispatch(getAllListPosition()), dispatch(getAllListDepartments()))
  //     ];
  //   };
  //   if (!fetchData) {
  //     callApi();
  //   }
  // }, [fetchData, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getListTimekeeping({
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
    const dataNew = listTimekeeping?.data.map((items, index) => {
      return {
        key: index,
        id: items?.employee_id,
        employee_id: items?.employee_id,
        name: items?.employee_name,
        department: items?.department,
        position: items?.position,
        total_holidays: items?.total_holidays,
        total_leave_days: items?.total_leave_days,
        total_unpaid_leave: items?.total_unpaid_leave,
        total_working: items?.total_working,
      };
    });
    setData(dataNew);
  }, [listTimekeeping]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getListMiniDashboardTimekeeping({
          currentPage,
          pageSize,
          month: dayjs().month() + 1,
          year: dayjs().year(),
          time_period: "month",
        })
      );
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Danh sách chấm công</h2>
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
            title: "Danh sách chấm công",
            href: "/list-timekeeping",
          },
        ]}
      />
      <Row gutter={[16, 16]} justify="center">
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <TableOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số công trong tháng</p>
              <p className="metric-value">
                {listMiniDashboardTimekeeping?.data?.cntTotalWorking || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <DashboardOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Số lượng người đi muộn / về sớm hôm nay</p>
              <p className="metric-value">
                {listMiniDashboardTimekeeping?.data?.cntLateInOutEarlyToday ||
                  0}
              </p>
            </div>
          </div>
        </Col>
        {/* <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <ScheduleOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số giờ OT tính tới hiện tại trong tháng</p>
              <p className="metric-value">
                {listMiniDashboardTimekeeping?.data?.cntOTMonth || 0}
              </p>
            </div>
          </div>
        </Col> */}
      </Row>
      <Divider />
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
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={columns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listTimekeeping?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadTimekeeping : false}
          dataSource={isLoadTimekeeping ? [] : data}
          locale={{
            emptyText: isLoadTimekeeping ? (
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
