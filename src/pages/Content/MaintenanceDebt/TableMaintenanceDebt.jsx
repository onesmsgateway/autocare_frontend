import { Breadcrumb, Col, Divider, Empty, Flex, Form, Input, Popover, Row, Skeleton, Table } from "antd";
import { getListMaintenanceDebt } from "../../../services/maintenanceDebt/maintenanceDebt";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import formatDateTime from "../../../utils/dateTime";
import EditMaintenanceDebt from "./EditMaintenanceDebt";

export default function TableMaintenanceDebt() {
  const [form] = Form.useForm();
  const { listMaintenanceDebt, isLoadMaintenanceDebt } = useSelector(
    (state) => state.maintenanceDebt
  );
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const dispatch = useDispatch();
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
      dispatch(getListMaintenanceDebt({
        currentPage,
        pageSize,
        search: value,
      }));
    }, 600)
  ).current;
  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      // setInputValue(value);
      delayedAction(value);
    },
    [delayedAction]
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListMaintenanceDebt({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listMaintenanceDebt?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        customer_id: items?.customer_id,
        maintenance_id: items?.maintenance_id,
        customer: items?.customer,
        maintenance: items?.maintenance,
        created_at: items?.created_at,
        debt: items?.debt,
        status: items?.status
      };
    });
    setData(dataNew);
  }, [listMaintenanceDebt]);

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      align: "center",
      // editable: true,
      width: "25%",
      render: (_, record) => {
        return record.customer?.full_name
      },
    },
    {
      title: "Công nợ",
      dataIndex: "debt",
      align: "center",
      // editable: true,
      width: "25%",
      render: (data, record) => (
        <span style={{ color: record?.debt < 0 ? "red" : "green" }}>
          {Number(data)?.toLocaleString("vi-vn")} VND
        </span>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      // editable: true,
      width: "25%",
      render: (_, record) => {
        // Xử lý trạng thái hiển thị
        let statusText = "";
        let color = "";

        if (record.status === "pending") {
          statusText = "Chờ xử lý";
          color = "orange";
        } else if (record.status === "completed") {
          statusText = "Hoàn thành";
          color = "green";
        }

        return <span style={{ color }}>{statusText}</span>;
      },
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
      title: "Chi tiết/Sửa",
      dataIndex: "operation",
      align: "center",
      width: "11%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditMaintenanceDebt
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
            // search={inputValue}
            />
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
      <h2>Quản lý công nợ</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Công nợ",
            href: "/maintenance-debts",
          },
        ]}
      />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <Input
            allowClear
            onChange={handleInputChange}
            // value={inputValue}
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
            total: listMaintenanceDebt?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadMaintenanceDebt : false}
          dataSource={isLoadMaintenanceDebt ? [] : data}
          locale={{
            emptyText: isLoadMaintenanceDebt ? (
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