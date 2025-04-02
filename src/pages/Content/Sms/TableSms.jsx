import {
  Badge,
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Row,
  Skeleton,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListSms } from "../../../services/sms/sms";
// import SentSms from "./SentSms";
import { Helmet } from "react-helmet";
import { CommentOutlined } from "@ant-design/icons";
import { getListMiniDashboardQuota } from "../../../services/miniDashboard/miniDashboard";

export default function TableSms() {
  const [form] = Form.useForm();
  const { listSms, isLoadigSms } = useSelector((state) => state.sms);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { listMiniDashboardQuota } = useSelector(
    (state) => state.miniDashboard
  );
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListSms({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listSms?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        sms_id: items.sms_id,
        sender_name: items?.sender_name,
        phone: items?.phone,
        sms: items?.sms,
        sms_type: items?.sms_type,
        status: items?.status,
        time_schedule: items?.time_schedule,
      };
    });
    setData(dataNew);
  }, [listSms]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      editable: true,
      width: "12.5%",
    },

    {
      title: "Sms_id",
      dataIndex: "sms_id",
      align: "center",
      editable: true,
      width: "12.5%",
    },
    {
      title: "Thương hiệu",
      dataIndex: "sender_name",
      align: "center",
      width: "12.5%",
      editable: true,
    },
    {
      title: "Gửi đến",
      dataIndex: "phone",
      align: "center",
      width: "12.5%",
      editable: true,
    },
    {
      title: "Nội dung",
      dataIndex: "sms",
      align: "center",
      width: "12.5%",
      editable: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: "12.5%",
      editable: true,
      // render: (record) =>
      //   record === "The account is not enough quota." ? (
      //     <Badge status="error" text="The account is not enough quota." />
      //   ) : (
      //     <Badge status="success" text="Đã gửi" />
      //   ),
    },
    {
      title: "Loại tin nhắn",
      dataIndex: "sms_type",
      align: "center",
      width: "12.5%",
      editable: true,
    },
    {
      title: "Thời gian gửi",
      dataIndex: "time_schedule",
      align: "center",
      width: "12.5%",
      editable: true,
      // render: (record) => {
      //   const time = formatDateTime(record);
      //   return time;
      // },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListMiniDashboardQuota({ currentPage, pageSize }));
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Danh sách tin nhắn</title>
        <meta name="description" content="Trang quản lý nhắn tin auto-care" />
      </Helmet>
      <h2>Danh sách tin nhắn</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Tin nhắn",
          },
          {
            title: "Danh sách tin nhắn",
            href: "/sms",
          },
        ]}
      />
      {/* <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <SentSms currentPage={currentPage} pageSize={pageSize} />
        </Col>
      </Row> */}
      <Row gutter={[16, 16]} justify="center">
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <CommentOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số Quota được cấp</p>
              <p className="metric-value">
                {listMiniDashboardQuota?.data?.quotaProvider || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <CommentOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số Quota đã dùng</p>
              <p className="metric-value">
                {listMiniDashboardQuota?.data?.quotaUsed || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <CommentOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số Quota còn lại</p>
              <p className="metric-value">
                {listMiniDashboardQuota?.data?.quotaRemain || 0}
              </p>
            </div>
          </div>
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
            total: listSms?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadigSms : false}
          dataSource={isLoadigSms ? [] : data}
          locale={{
            emptyText: isLoadigSms ? (
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
          scroll={{ x: 600, y: 520 }}
        />
      </Form>
    </div>
  );
}
