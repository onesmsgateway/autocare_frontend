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
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import formatDateTime from "../../../utils/dateTime";
import useGetData from "../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import AddWareHouse from "./AddWareHouse";
import EditWareHouse from "./EditWareHouse";
import { deleteWareHouse, getListWareHouse } from "../../../services/warehouse/warehouse";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";

export default function TableWareHouse() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listWarehouse, isLoadWarehouse } = useSelector((state) => state.warehouse);
  const [data, setData] = useState([]);
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListWareHouse);
  const { handleDelete } = useDeleteHandler(
    deleteWareHouse,
    getListWareHouse,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  useEffect(() => {
    const dataNew = listWarehouse?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        company_id: items?.company_id,
        // store_id: items?.store_id,
        name: items?.name,
        content: items?.content,
        // store: items?.store?.store_name,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listWarehouse]);
  const columns = [
    {
      title: "Tên kho",
      dataIndex: "name",
      // editable: true,
      width: "20%",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      align: "center",
      // editable: true,
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "20%",
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
      width: "20%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditWareHouse
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
  const [inputValue, setInputValue] = useState("");
  const delayedSearch = useRef(
    debounce((value) => {
      store.dispatch(getListWareHouse({ currentPage, pageSize, value }));
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
      <h2>Quản lý kho</h2>
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
            title: "Quản lý kho",
            href: "/warehouse",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddWareHouse currentPage={currentPage} pageSize={pageSize} />
        </Col>
      </Row>
      <Divider />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <Input
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên"
          />
        </Col>
      </Row>
      <Divider/>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listWarehouse?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadWarehouse : false}
          dataSource={isLoadWarehouse ? [] : data}
          locale={{
            emptyText: isLoadWarehouse ? (
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
          scroll={{ x: 1000,y:520 }}
        />
      </Form>
    </div>
  );
}
