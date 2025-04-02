import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDateTime from "../../../utils/dateTime";

import {
  deleteDepartment,
  getListDepartments,
} from "../../../services/department/department";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";
import AddDepartment from "./AddDepartment";
import { DeleteOutlined } from "@ant-design/icons";
import EditDepartment from "./EditDepartment";

export default function TableDepartment() {
  const [form] = Form.useForm();
  const { listDepartments, isLoadDepartments } = useSelector(
    (state) => state.departments
  );
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const delayedAction = useRef(
    debounce((value) => {
      dispatch(getListDepartments({
        currentPage,
        pageSize,
        search: value,
      }));
    }, 600)
  ).current;

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      delayedAction(value);
    },
    [delayedAction]
  );
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListDepartments({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listDepartments?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        name: items?.name,
        note: items?.note,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listDepartments]);

  const handleDelete = async (record) => {
    try {
      const response = await dispatch(deleteDepartment(record.id));
      if (deleteDepartment.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await dispatch(
          getListDepartments({
            currentPage,
            pageSize,
            search: inputValue,
          })
        );
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteDepartment.rejected.match(response)) {
        if (response.payload.error) {
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "Tên bộ phận",
      dataIndex: "name",
      align: "center",
      // editable: true,
      width: "25%",
    },
    {
      title: "Mô tả",
      dataIndex: "note",
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
      width: "11%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditDepartment
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
              search={inputValue}
            />
            <Tooltip placement="top" title="Xóa">
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
      <h2>Quản lý bộ phận</h2>
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
            title: "Bộ phận",
            href: "/department",
          },
        ]}
      />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <AddDepartment
            currentPage={currentPage}
            pageSize={pageSize}
            search={inputValue}
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
            total: listDepartments?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadDepartments : false}
          dataSource={isLoadDepartments ? [] : data}
          locale={{
            emptyText: isLoadDepartments ? (
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
