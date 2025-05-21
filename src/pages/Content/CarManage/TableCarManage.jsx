import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
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
import EditVehicleMaintenance from "./EditCarManage";
import {
  deleteCarManage,
  getListCarManage,
} from "../../../services/carmanage/carmanage";
import { getAllListStores } from "../../../services/stores/stores";
import { NavLink, useNavigate } from "react-router-dom";

export default function TableCarManage() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listCarManage, isLoadCarManage } = useSelector(
    (state) => state.carmanage
  );
  const [data, setData] = useState([]);
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListCarManage);
  const { handleDelete } = useDeleteHandler(
    deleteCarManage,
    getListCarManage,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );
  useEffect(() => {
    store.dispatch(getAllListStores());
  }, []);
  useEffect(() => {
    const dataNew = listCarManage?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        customer_id: items?.customer_id,
        full_name: items?.customer?.full_name,
        store: items?.store?.store_name,
        store_id: items?.store_id,
        customer: items?.customer,
        type: items?.type,
        name_bike: items?.name_bike,
        license_plate: items?.license_plate,
        frame_number: items?.frame_number,
        machine_number: items?.machine_number,
        company_id: items?.company_id,
        warranty_number: items?.warranty_number,
        motor_price: items?.motor_price,
        day_sale: items?.day_sale,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listCarManage]);
  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "full_name",
      width: "12.5%",
      align: "center",
      render: (_, record) => {
        const checkGender =
          record.customer?.gender === "MALE"
            ? "Nam"
            : record.customer?.gender === "FEMALE"
            ? "Nữ"
            : record.customer?.gender === "OTHER"
            ? "Khác"
            : "";
        const title = (
          <>
            <p>Ngày sinh : {record.customer?.birth_day}</p>
            <p>Số điện thoại : {record.customer?.phone}</p>
            <p>Giới tính : {checkGender}</p>
          </>
        );
        return (
          <Popover
            className="config-hover"
            placement="top"
            title={"Thông tin khách hàng"}
            content={title}
          >
            {record?.full_name}
          </Popover>
        );
      },
    },
    {
      title: "Tên xe",
      dataIndex: "name_bike",
      width: "12.5%",
      align: "center",
      render: (text, record) => (
        <Tooltip title="Chi tiết xe">
          <NavLink to={`/detail-car-manage/${record.id}`}>{text}</NavLink>
        </Tooltip>
      ),
    },
    {
      title: "Biển số",
      dataIndex: "license_plate",
      align: "center",
      // editable: true,
      width: "12.5%",
    },
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
      title: "Ngày mua",
      dataIndex: "day_sale",
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
      title: "Loại",
      dataIndex: "type",
      align: "center",
      // editable: true,
      width: "12.5%",
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
      title: "Sửa/Xóa/Tạo bảo dưỡng",
      dataIndex: "operation",
      align: "center",
      width: "12.5%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditVehicleMaintenance
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
            <Tooltip placement="leftTop" title="Tạo bảo dưỡng">
              <PlusCircleOutlined
                style={{ color: "#40a9ff", fontSize: 20 }}
                onClick={() => navigate(`/addMaintenance/${record?.id}`)}
              />
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
      store.dispatch(getListCarManage({ currentPage, pageSize, value }));
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
  const navigate = useNavigate();
  return (
    <div>
      <h2>Danh sách xe khách hàng</h2>
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
            title: "Danh sách xe khách hàng",
            href: "/car-customer-manage",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <Button
            type="primary"
            onClick={() => navigate(`/add-car`)}
            icon={<PlusCircleOutlined />}
          >
            Thêm mới
          </Button>
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
            placeholder="Tìm kiếm theo tên khách hàng hoặc biển số xe"
          />
        </Col>
      </Row>
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          // expandable={{
          //   expandedRowRender: (record) => {
          //     const columns = [
          //       // {
          //       //   title: "Tên khách hàng",
          //       //   dataIndex: "full_name",
          //       // },
          //       {
          //         title: "Ngày sinh",
          //         dataIndex: "birth_day",
          //       },
          //       {
          //         title: "Số điện thoại",
          //         dataIndex: "phone",
          //       },
          //       {
          //         title: "Giới tính",
          //         dataIndex: "gender",
          //         render: (_, record) => {
          //           const checkGender =
          //             record.gender === "MALE"
          //               ? "Nam"
          //               : record.gender === "FEMALE"
          //               ? "Nữ"
          //               : record.gender === "OTHER"
          //               ? "Khác"
          //               : "";
          //           return checkGender;
          //         },
          //       },
          //     ];
          //     const data = [
          //       {
          //         key: record.customer.id,
          //         full_name: record.customer.full_name,
          //         birth_day: record.customer.birth_day,
          //         phone: record.customer.phone,
          //         gender: record.customer.gender,
          //       },
          //     ];
          //     return (
          //       <Table
          //         columns={columns}
          //         dataSource={data}
          //         size="small"
          //         pagination={false}
          //         bordered
          //       />
          //     );
          //   },
          // }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listCarManage?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadCarManage : false}
          dataSource={isLoadCarManage ? [] : data}
          locale={{
            emptyText: isLoadCarManage ? (
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
