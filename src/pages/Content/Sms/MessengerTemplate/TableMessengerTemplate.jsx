import { DeleteOutlined } from "@ant-design/icons";
import {
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
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormAddMessenerTemplate from "./FormAddMessenerTemplate";
import {
  deleteTemplateMess,
  getListTemplateSms,
} from "../../../../services/sms/sms";
import formatDateTime from "../../../../utils/dateTime";
import EditTemplateMess from "./EditTemplateMess";
import { Helmet } from "react-helmet";

export default function TableMessengerTemplate() {
  const [form] = Form.useForm();
  const { listTemplateSms, isLoadingTemplateSms } = useSelector(
    (state) => state.sms
  );
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

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListTemplateSms({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listTemplateSms?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        content: items?.content,
        type: items?.type,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listTemplateSms]);
  const handleDelete = async (record) => {
    try {
      const response = await dispatch(deleteTemplateMess(record.id));
      if (deleteTemplateMess.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await dispatch(getListTemplateSms({ currentPage, pageSize }));
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteTemplateMess.rejected.match(response)) {
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
  const columns = [
    {
      title: "Nội dung",
      dataIndex: "content",
      editable: true,
      width: "25%",
    },
    {
      title: "Loại tin nhắn",
      dataIndex: "type",
      editable: true,
      width: "25%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "25%",
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
      width: "25%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditTemplateMess
              record={record}
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
  return (
    <>
      <Helmet>
        <title>Mẫu tin nhắn</title>
        <meta
          name="description"
          content="Trang tạo mẫu tin nhắn cấu hình auto-care"
        />
      </Helmet>
      <h2>Mẫu tin nhắn</h2>
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
            title: "Mẫu tin nhắn",
            href: "/message-template",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <FormAddMessenerTemplate
            currentPage={currentPage}
            pageSize={pageSize}
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
            total: listTemplateSms?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadingTemplateSms : false}
          dataSource={isLoadingTemplateSms ? [] : data}
          locale={{
            emptyText: isLoadingTemplateSms ? (
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
          scroll={{ x: 600,y:520 }}
        />
      </Form>
    </>
  );
}
