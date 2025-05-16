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
  Popover,
  Row,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { store } from "../../../redux/configStores";
import formatDateTime from "../../../utils/dateTime";
import useGetData from "../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import { useSelector } from "react-redux";
import { getAllListStores } from "../../../services/stores/stores";
import { NavLink } from "react-router-dom";
import { deleteMotorStore, getListMotorStore } from "../../../services/motorStore/motorStore";
import FormAddCarStore from "./FormAddCarStore";
import FormEditCarStore from "./FormEditCarStore";


export default function TableCarStoreManage() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listMotorStore, isLoadMotorStore } = useSelector(
    (state) => state.motorStore
  );
  const [data, setData] = useState([]);
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListMotorStore);
  const { handleDelete } = useDeleteHandler(
    deleteMotorStore,
    getListMotorStore,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );
  useEffect(() => {
    store.dispatch(getAllListStores());
  }, []);
  useEffect(() => {
    const dataNew = listMotorStore?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        store: items?.store?.store_name,
        store_id: items?.store_id,
        name_bike: items?.name_bike,
        // license_plate: items?.license_plate,
        frame_number: items?.frame_number,
        machine_number: items?.machine_number,
        company_id: items?.company_id,
        warranty_number: items?.warranty_number,
        quantity: items?.quantity,
        motor_price: items?.motor_price,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listMotorStore]);
  const columns = [
    {
      title: "Tên xe",
      dataIndex: "name_bike",
      width: "12.5%",
      align: "center",
      // render: (text, record) => (
      //   <Tooltip title="Chi tiết xe">
      //     <NavLink to={`/detail-car-manage/${record.id}`}>{text}</NavLink>
      //   </Tooltip>
      // ),
    },
    // {
    //   title: "Biển số",
    //   dataIndex: "license_plate",
    //   align: "center",
    //   // editable: true,
    //   width: "12.5%",
    // },
    {
      title: "Số khung",
      dataIndex: "frame_number",
      align: "center",
      // editable: true,
      width: "12.5%",
      // render: (record) => record.toLocaleString(),
    },
    {
      title: "Số máy móc",
      dataIndex: "machine_number",
      align: "center",
      // editable: true,
      width: "12.5%",
    },
    {
      title: "Số bảo hành",
      dataIndex: "warranty_number",
      align: "center",
      // editable: true,
      width: "12.5%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      // editable: true,
      width: "12.5%",
    },
    {
      title: "Giá xe",
      dataIndex: "motor_price",
      align: "center",
      // editable: true,
      width: "12.5%",
      render: (record) => record?.toLocaleString(),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "12.5%",
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
      width: "12.5%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <FormEditCarStore
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
      store.dispatch(getListMotorStore({ currentPage, pageSize, value }));
    }, 1000)
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
      <h2>Danh sách xe</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Bảo dưỡng xe",
          },
          {
            title: "Danh sách xe",
            href: "/car-manage",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
        <FormAddCarStore currentPage={currentPage} pageSize={pageSize} />
        </Col>
      </Row>
      <Divider />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <Input
            style={{ width: 400 }}
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo biển số xe"
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
            total: listMotorStore?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadMotorStore : false}
          dataSource={isLoadMotorStore ? [] : data}
          locale={{
            emptyText: isLoadMotorStore ? (
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
