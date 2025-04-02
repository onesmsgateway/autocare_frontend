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

import {
  deleteGroupCustomer,
  getListGroupCustomer,
} from "../../../services/groupCustomer/groupCustomer";
import AddGroupCustomer from "./AddGroupCustomer";
import formatDateTime from "../../../utils/dateTime";
import { store } from "../../../redux/configStores";
import EditGroupCustomer from "./EditGroupCustomer";
import { Helmet } from "react-helmet";

export default function TableGroupCustomer() {
  const [form] = Form.useForm();
  const { listgroupCusomer, isloading } = useSelector(
    (state) => state.groupCustomer
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
      await dispatch(getListGroupCustomer({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listgroupCusomer?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        name: items?.name,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listgroupCusomer]);
  const handleDelete = async (record) => {
    try {
      const response = await store.dispatch(deleteGroupCustomer(record.id));
      if (deleteGroupCustomer.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await store.dispatch(getListGroupCustomer({ currentPage, pageSize }));
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteGroupCustomer.rejected.match(response)) {
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
      title: "Tên nhóm",
      dataIndex: "name",
      align: "center",
      // editable: true,
      width: "25%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "25%",
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
      width: "25%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditGroupCustomer
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
    <div>
      <Helmet>
        <title>Nhóm khách hàng</title>
        <meta
          name="description"
          content="Trang quản lý nhóm khách hàng auto-care"
        />
      </Helmet>
      <h2>Quản lý nhóm khách hàng</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Khách hàng",
          },
          {
            title: "Nhóm khách hàng",
            href: "/group-customer",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddGroupCustomer currentPage={currentPage} pageSize={pageSize} />
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
            total: listgroupCusomer?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isloading : false}
          dataSource={isloading ? [] : data}
          locale={{
            emptyText: isloading ? (
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
