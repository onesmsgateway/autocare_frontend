import { DeleteOutlined } from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Popconfirm,
  Row,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import useGetData from "../../../components/CustomHooks/useGetData";
import {
  deleteScheduleSms,
  getListScheduleSms,
} from "../../../services/sms/sms";
import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import formatDateTime from "../../../utils/dateTime";
import AddScheduleSms from "./AddScheduleSms";
import EditScheduleSms from "./EditScheduleSms";
export default function ScheduleSms() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listScheduleSms, isLoadListScheduleSms } = useSelector(
    (state) => state.sms
  );
  const [data, setData] = useState([]);
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListScheduleSms);
  const { handleDelete } = useDeleteHandler(
    deleteScheduleSms,
    getListScheduleSms,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  console.log('list schedule sms', listScheduleSms);

  useEffect(() => {
    const dataNew = listScheduleSms?.map((items) => {
      return {
        key: items.id,
        id: items.id,
        company_id: items?.company_id,
        customers: items?.customers,
        customer_ids: items?.customers.map((customer) => customer.id) ?? [],
        content: items?.content,
        send_time: items?.send_time,
        status: items?.status,
        note: items?.note,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listScheduleSms]);
  const columns = [
    {
      title: "Nội dung",
      dataIndex: "content",
      align: "center",
      editable: true,
      width: "20%",
    },
    {
      title: "Thời gian gửi tin",
      dataIndex: "send_time",
      align: "center",
      editable: true,
      width: "20%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      editable: true,
      width: "20%",
      render: (record) =>
        record === "ToDo" ? (
          <Badge status="processing" text="Đang chờ" />
        ) : (
          <Badge status="success" text="Đã gửi" />
        ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      align: "center",
      editable: true,
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "20%",
      editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      width: "20%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditScheduleSms
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
            />
            <Tooltip placement="leftTop" title="Xóa">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record.id)}
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
  return (
    <div>
      <Helmet>
        <title>Danh sách lịch nhắn tin</title>
        <meta name="description" content="Trang quản lý nhắn tin auto-care" />
      </Helmet>
      <h2>Danh sách lịch nhắn tin</h2>
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
            title: "Đặt lịch nhắn tin",
            href: "/schedule-sms",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddScheduleSms currentPage={currentPage} pageSize={pageSize} />
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
            total: listScheduleSms?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadListScheduleSms : false}
          dataSource={isLoadListScheduleSms ? [] : data}
          locale={{
            emptyText: isLoadListScheduleSms ? (
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
