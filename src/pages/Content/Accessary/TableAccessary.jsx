import { DeleteOutlined, FileExcelOutlined } from "@ant-design/icons";
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
  Row,
  Skeleton,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDateTime from "../../../utils/dateTime";
import useGetData from "../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import {
  deleteAccessarys,
  exportExcelAccessarys,
  getListAccessarys,
} from "../../../services/accessarys/accessarys";
import AddAccessary from "./AddAccessary";
import EditAccessary from "./EditAccessary";
import { store } from "../../../redux/configStores";
import { debounce } from "lodash";
import { getAllListSupplier } from "../../../services/supplier/supplier";
import { getAllListStores } from "../../../services/stores/stores";
import ModalImportAccessary from "./ModalImportAccessary";
import axios from "axios";
import { settings } from "../../../utils/config";
export default function TableAccessary() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listAccessarys, isLoadAccessarys } = useSelector(
    (state) => state.accessarys
  );
  const { allListStores, isLoadStoresAll } = useSelector(
    (state) => state.stores
  );
  const { allListSupplier, isLoadAllSupplier } = useSelector(
    (state) => state.supplier
  );
  const optionsSupplier = allListSupplier?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });
  const optionsStore = allListStores?.data?.map((item) => {
    return {
      label: item.store_name,
      value: item.id,
    };
  });
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState("");
  const [inputValue, setInputValue] = useState("");
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListAccessarys, filters);
  const { handleDelete } = useDeleteHandler(
    deleteAccessarys,
    getListAccessarys,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );
  useEffect(() => {
    store.dispatch(getAllListSupplier());
    store.dispatch(getAllListStores());
  }, []);
  useEffect(() => {
    const dataNew = listAccessarys?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        warehouse_id: items.warehouse_id,
        warehouse: items?.warehouse?.name,
        company_id: items.company_id,
        code_accessary: items?.code_accessary,
        price: items?.price,
        name_accessary: items?.name_accessary,
        unit: items?.unit,
        inventory_quantity: items?.inventory_quantity,
        threshold_quantity: items?.threshold_quantity,
        code_accessary_1: items?.code_accessary_1,
        replace_code_accessary: items?.replace_code_accessary,
        name_eng: items?.name_eng,
        model: items?.model,
        supplier_id: items?.supplier_id,
        type: items?.type,
        pay_money: items?.pay_money,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listAccessarys]);
  const columns = [
    {
      title: "Mã phụ tùng-vật tư",
      dataIndex: "code_accessary",
      // editable: true,
      width: "10%",
    },
    {
      title: "Tên phụ tùng-vật tư",
      dataIndex: "name_accessary",
      align: "center",
      // editable: true,
      width: "10%",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "center",
      // editable: true,
      width: "10%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      align: "center",
      // editable: true,
      width: "10%",
    },
    {
      title: "Kho hàng",
      dataIndex: "warehouse",
      align: "center",
      // editable: true,
      width: "10%",
    },
    {
      title: "Số lượng",
      dataIndex: "inventory_quantity",
      align: "center",
      // editable: true,
      width: "10%",
    },
    // {
    //   title: "Ngưỡng số lượng",
    //   dataIndex: "threshold_quantity",
    //   align: "center",
    //   // editable: true,
    //   width: "10%",
    // },

    {
      title: "Model",
      dataIndex: "model",
      align: "center",
      // editable: true,
      width: "10%",
    },
    // {
    //   title: "Tiền trả thợ",
    //   dataIndex: "pay_money",
    //   align: "center",
    //   // editable: true,
    //   width: "10%",
    //   render: (record) => record.toLocaleString(),
    // },
    {
      title: "Sửa/Xóa",
      dataIndex: "operation",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditAccessary
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
              optionsStore={optionsStore}
              isLoadStoresAll={isLoadStoresAll}
              optionsSupplier={optionsSupplier}
              isLoadAllSupplier={isLoadAllSupplier}
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

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleExportExcel = async () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const exportUrl = `${baseUrl}/company/api/v1/accessary-export`;
    const hasAccessToken = settings?.getCookie("access_token");
    // try {
    //   const response = await store.dispatch(exportExcelAccessarys());
    //   const url = baseUrl + response?.payload?.url;
    //   const link = document.createElement("a");
    //   link.href = url;
    //   // link.setAttribute("download", "CustomerMotorExport.xlsx");
    //   document.body.appendChild(link);
    //   // Bấm vào liên kết để tải xuống tệp
    //   link.click();
    //   // Xóa đối tượng URL sau khi tệp đã được tải xuống
    //   window.URL.revokeObjectURL(url);
    //   // Xóa thẻ <a> sau khi đã sử dụng
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      console.log('aaa', exportUrl);
      const response = await axios.get(exportUrl, {
        responseType: "blob", // Quan trọng để xử lý file
        headers: {
          Authorization: `Bearer ${hasAccessToken}`, // Nếu cần token
        },
      });
      console.log(response);
      // Tạo URL blob từ phản hồi
      const url = window.URL.createObjectURL(new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "PhuTungVaPhuKien.xlsx"); // Tên file tải xuống
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();
  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value === "") {
        // Khi inputValue bị xóa, chỉ fetch với status
        await dispatch(
          getListAccessarys({ currentPage, pageSize, type: filters })
        );
      } else {
        await dispatch(
          getListAccessarys({
            currentPage,
            pageSize,
            type: filters,
            search: value,
          })
        );
      }
    }, 1000), // Thời gian debounce, ví dụ 300ms
    [dispatch, currentPage, pageSize, filters]
  );
  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleFileterAccesary = useCallback((value) => {
    setFilters(value);
  }, []);
  const items = [
    {
      key: "",
      label: "Tất cả",
      disabled: isLoadAccessarys,
    },
    {
      key: "PhuTung",
      label: "Phụ tùng",
      disabled: isLoadAccessarys,
    },
    {
      key: "PhuKien",
      label: "Phụ kiện",
      disabled: isLoadAccessarys,
    },
    {
      key: "VatTu",
      label: "Vật tư",
      disabled: isLoadAccessarys,
    },
  ];
  return (
    <div>
      <h2>Quản lý phụ tùng-vật tư</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Phụ tùng-vật tư",
          },
          {
            title: "Quản lý phụ tùng-vật tư",
            href: "/accessary",
          },
        ]}
      />
      <Row justify={"space-between"} gutter={[8, 8]}>
        <Col xl={18} lg={18} md={18} sm>
          <AddAccessary
            currentPage={currentPage}
            pageSize={pageSize}
            optionsStore={optionsStore}
            isLoadStoresAll={isLoadStoresAll}
            optionsSupplier={optionsSupplier}
            isLoadAllSupplier={isLoadAllSupplier}
          />
        </Col>
        <Col xl={3} lg={3} md={3} sm>
          <ModalImportAccessary currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl={3} lg={3} md={3} sm>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            disabled={data?.length === 0}
            onClick={handleExportExcel}
          >
            Xuất file excel
          </Button>
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
      <Divider />
      <Tabs
        activeKey={filters}
        items={items}
        onChange={handleFileterAccesary}
      />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          expandable={{
            expandedRowRender: (record) => {
              const columns = [
                {
                  title: "Mã phụ tùng 1",
                  dataIndex: "code_accessary_1",
                  align: "center",
                  editable: true,
                },
                {
                  title: "Mã thay thế",
                  dataIndex: "replace_code_accessary",
                  align: "center",
                  editable: true,
                },
                {
                  title: "Tên tiếng anh",
                  dataIndex: "name_eng",
                  align: "center",
                  editable: true,
                },
                {
                  title: "Ngày tạo",
                  dataIndex: "created_at",
                  align: "center",
                  editable: true,
                  render: (record) => {
                    const time = formatDateTime(record);
                    return time;
                  },
                },
              ];
              const data = [
                {
                  code_accessary_1: record.code_accessary_1,
                  replace_code_accessary: record.replace_code_accessary,
                  name_eng: record.name_eng,
                  created_at: record.created_at,
                },
              ];
              return (
                <Table
                  columns={columns}
                  dataSource={data}
                  size="small"
                  pagination={false}
                  bordered
                />
              );
            },
          }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listAccessarys?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadAccessarys : false}
          dataSource={isLoadAccessarys ? [] : data}
          locale={{
            emptyText: isLoadAccessarys ? (
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
          scroll={{ x: 600 }}
        />
      </Form>
    </div>
  );
}
