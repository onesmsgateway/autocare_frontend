import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomer,
  exportExcelCustomer,
  getListCustomer,
} from "../../../services/customer/customer";
import {
  DeleteOutlined,
  FileExcelOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import AddCustomer from "./AddCustomer";
import { store } from "../../../redux/configStores";
import EditCustomer from "./EditCustomer";
import { getAllListGroupCustomer } from "../../../services/groupCustomer/groupCustomer";
import { debounce } from "lodash";
import useGetData from "../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import ModalImportExcel from "./ModalImportExcel";
import { NavLink, useNavigate } from "react-router-dom";
import { getListMiniDashboardCustomers } from "../../../services/miniDashboard/miniDashboard";
import { settings } from "../../../utils/config";
import axios from "axios";
export default function TableCustomer() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const dispatch = useDispatch();
  const { listCustomer, loading } = useSelector((state) => state.customer);
  const { allListgroupCustomer, isLoadingAll } = useSelector(
    (state) => state.groupCustomer
  );
  const { listMiniDashboardCustomers } = useSelector(
    (state) => state.miniDashboard
  );
  const optionGroupCustomer = allListgroupCustomer?.data?.map((item) => {
    return {
      label: item.name,
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
  } = useGetData(getListCustomer, filters);
  const { handleDelete } = useDeleteHandler(
    deleteCustomer,
    getListCustomer,
    currentPage,
    pageSize,
    data,
    setCurrentPage,
    undefined,
    getListMiniDashboardCustomers
  );
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllListGroupCustomer());
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    const dataNew = listCustomer?.data?.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        full_name: items?.full_name,
        gender: items.gender,
        birth_day: items?.birth_day,
        phone: items.phone,
        group_id: items.group_id,
        address: items.address,
        purchase_date: items.purchase_date,
        citizen_identification: items.citizen_identification,
        warranty_number: items.warranty_number,
        category: items?.category,
        maintain_quantity: items.maintain_quantity,
        sms_change_oil: items.sms_change_oil,
        is_sms_change_oil: items.is_sms_change_oil,
        sms_change_bugi: items.sms_change_bugi,
        sms_change_train_oil: items.sms_change_train_oil,
        sms_change_straps: items.sms_change_straps,
        sms_change_air_filter: items.sms_change_air_filter,
        zalo_id: items.zalo_id,
        motors: items.motors,
        is_sms_birthday: items.is_sms_birthday,
        created_at: items.created_at,
        created_by: items?.created_by,
        creator: items?.creator,
      };
    });
    setData(dataNew);
  }, [listCustomer]);
  const navigate = useNavigate();
  const columns = [
    {
      title: "Tên",
      dataIndex: "full_name",
      width: "16%",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: "16%",
      render: (_, record) => {
        const checkGender =
          record.gender === "MALE"
            ? "Nam"
            : record.gender === "FEMALE"
              ? "Nữ"
              : record.gender === "OTHER"
                ? "Khác"
                : "";
        return checkGender;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_day",
      align: "center",
      width: "16%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
      width: "16%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
      width: "16%",
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      align: "center",
      width: "8.8%",
      // editable: true,
      render: (_, record) => {
        const creator = record?.creator;

        if (!creator) return "N/A";

        const { username, type } = creator;
        const role = type === 'MANAGER' ? 'Quản lý' : type === 'STAFF' ? 'Nhân Viên' : type === 'CUSTOMER' ? 'Khách hàng' : '';

        return `${username} (${role})`;
      },
    },
    {
      title: "Sửa/Xóa/Thêm xe",
      dataIndex: "operation",
      align: "center",
      width: "16%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditCustomer
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
            <Tooltip placement="leftTop" title="Thêm xe">
              <PlusCircleOutlined
                style={{ color: "#40a9ff", fontSize: 20 }}
                onClick={() => navigate(`/add-car/${record?.id}`)}
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
  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value === "") {
        // Khi inputValue bị xóa, chỉ fetch với status
        await dispatch(
          getListCustomer({ currentPage, pageSize, group_id: filters })
        );
      } else {
        await dispatch(
          getListCustomer({
            currentPage,
            pageSize,
            group_id: filters,
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
  const handleFilterCustomer = useCallback((value) => {
    setFilters(value);
  }, []);

  const handleExportExcel = async () => {

    const baseUrl = import.meta.env.VITE_API_URL;
    const exportUrl = `${baseUrl}/customer/api/v1/customer-export`;
    const hasAccessToken = settings?.getCookie("access_token");
    // try {
    //   const response = await store.dispatch(exportExcelCustomer());
    //   const url = baseUrl + response?.payload?.url;
    //   // console.log(url)
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
      link.setAttribute("download", "KhachHangVaXe.xlsx"); // Tên file tải xuống
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getListMiniDashboardCustomers({ currentPage, pageSize }));
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Khách hàng</title>
        <meta name="description" content="Trang quản lý khách hàng auto-care" />
      </Helmet>
      <h2>Quản lý khách hàng</h2>
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
            title: "Danh sách khách hàng",
            href: "/customer",
          },
        ]}
      />
      <Row gutter={[16, 16]} justify="center">
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <TeamOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số khách hàng</p>
              <p className="metric-value">
                {listMiniDashboardCustomers?.data?.cntCustomers || 0}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <UserSwitchOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Số khách hàng đang dùng dịch vụ</p>
              <p className="metric-value">
                {listMiniDashboardCustomers?.data?.customerUseService || 0}
              </p>
            </div>
          </div>
        </Col>
        {/* <Col xl={6} lg={6} md={8} sm={12} xs={24}>
          <div className="metric-card">
            <div className="icon-wrapper">
              <DashboardOutlined className="metric-icon" />
            </div>
            <div className="metric-content">
              <p>Tổng số nhân sự đang nghỉ hôm nay</p>
              <p className="metric-value">
                {listMiniDashboardCustomers?.data?.cntOTMonth || 0}
              </p>
            </div>
          </div>
        </Col> */}
      </Row>
      <Divider />
      <Row justify={"space-between"} gutter={[16, 16]}>
        <Col xl={18} lg={18} md={18} sm>
          <AddCustomer
            isLoadingAll={isLoadingAll}
            optionGroupCustomer={optionGroupCustomer}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </Col>
        <Col xl={3} lg={3} md={3} sm>
          <ModalImportExcel currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl={3} lg={3} md={3} sm>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            disabled={data?.length === 0}
            onClick={() => handleExportExcel()}
          >
            Xuất file excel
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[8, 8]}>
        {/* <Col xl lg md sm>
          <Select
            showSearch
            virtual
            allowClear
            style={{ width: "300px" }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              optionA?.label
                ?.toLowerCase()
                .localeCompare(optionB?.label?.toLowerCase())
            }
            disabled={isLoadingAll || loading}
            placeholder="Lọc theo nhóm khách hàng"
            options={optionGroupCustomer}
            onChange={handleFilterCustomer}
          />
        </Col> */}
        <Col xl lg md sm>
          <Input
            style={{ width: 300 }}
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          />
        </Col>
      </Row>
      <Divider />
      <Table
        columns={mergedColumns}
        expandable={{
          expandedRowRender: (record) => {
            const columns = [
              {
                title: "Tên xe",
                dataIndex: "name_bike",
                render: (text, record) => (
                  <Tooltip title="Chi tiết xe">
                    <NavLink to={`/detail-car-manage/${record.id}`}>
                      {text}
                    </NavLink>
                  </Tooltip>
                ),
              },
              {
                title: "Biển số",
                dataIndex: "license_plate",
              },
              {
                title: "Số máy",
                dataIndex: "machine_number",
              },
              {
                title: "Số khung",
                dataIndex: "frame_number",
              },
              {
                title: "Số bảo hành",
                dataIndex: "warranty_number",
              },
            ];
            const data = record?.motors?.map((item) => {
              return {
                id: item.id,
                name_bike: item.name_bike,
                license_plate: item.license_plate,
                machine_number: item.machine_number,
                frame_number: item.frame_number,
                maintain_quantity: item.maintain_quantity,
                warranty_number: item.warranty_number,
              };
            });
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
          total: listCustomer?.total,
          current: currentPage,
          onChange: handlePageChange,
          pageSizeOptions: [10, 20, 30],
        }}
        loading={data?.length === 0 ? loading : false}
        dataSource={loading ? [] : data}
        locale={{
          emptyText: loading ? (
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
    </div>
  );
}
