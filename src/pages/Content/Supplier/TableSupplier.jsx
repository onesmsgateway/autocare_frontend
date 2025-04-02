import { DeleteOutlined } from "@ant-design/icons";
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
  Table,
  Tooltip,
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSupplier,
  getListSupplier,
} from "../../../services/supplier/supplier";
import formatDateTime from "../../../utils/dateTime";
import { store } from "../../../redux/configStores";
import AddSupplier from "./AddSupplier";
import EditSupplier from "./EditSupplier";
import { debounce } from "lodash";

export default function TableSupplier() {
  const [form] = Form.useForm();
  const { listSupplier, isLoadSupplier } = useSelector(
    (state) => state.supplier
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
      await dispatch(getListSupplier({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listSupplier?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        name: items?.name,
        address: items?.address,
        phone: items?.phone,
        email: items?.email,
        tax_code: items?.tax_code,
        delegater: items?.delegater,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listSupplier]);
  const handleDelete = async (record) => {
    try {
      const response = await store.dispatch(deleteSupplier(record.id));
      if (deleteSupplier.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await store.dispatch(getListSupplier({ currentPage, pageSize }));
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteSupplier.rejected.match(response)) {
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      // editable: true,
      width: "11%",
    },

    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
      width: "11%",
      // editable: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
      width: "11%",
      // editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      width: "11%",
      // editable: true,
    },
    {
      title: "Mã số thuế",
      dataIndex: "tax_code",
      align: "center",
      width: "11%",
      // editable: true,
    },
    {
      title: "Người đại diện",
      dataIndex: "delegater",
      align: "center",
      width: "11%",
      // editable: true,
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
            <EditSupplier
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
  const [inputValue, setInputValue] = useState("");
  const delayedSearch = useRef(
    debounce((value) => {
      store.dispatch(getListSupplier({ currentPage, pageSize, value }));
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
      <h2>Quản lý nhà cung cấp</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Danh mục",
          },
          {
            title: "Nhà cung cấp",
            href: "/supplier",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddSupplier currentPage={currentPage} pageSize={pageSize} />
        </Col>
      </Row>
      <Divider />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <Input
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên và số điện thoại"
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
            total: listSupplier?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadSupplier : false}
          dataSource={isLoadSupplier ? [] : data}
          locale={{
            emptyText: isLoadSupplier ? (
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
