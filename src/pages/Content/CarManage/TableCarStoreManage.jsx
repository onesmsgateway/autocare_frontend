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
  Modal,
  Popconfirm,
  Popover,
  Row,
  Skeleton,
  Table,
  Tooltip,
  message,
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
import ModalImportCarStore from "./ModalImportCarStore";
import { generateUpdateOtp, verifyUpdateOtp } from "../../../services/otp/otp";
import { settings } from "../../../utils/config";
import axios from "axios";


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
        // frame_number: items?.frame_number,
        // machine_number: items?.machine_number,
        company_id: items?.company_id,
        // warranty_number: items?.warranty_number,
        quantity: items?.quantity,
        motor_price: items?.motor_price,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listMotorStore]);

  const { userData } = useSelector((state) => state.user);
  // Xử lý click xóa
  const onDeleteClick = (id) => {
      const authType = userData?.data.type;
    if (authType === 'MANAGER') {
      // Sinh OTP nếu thay đổi số lượng
      handleGenerateOtp(id);
    } else {
      // Update ngay nếu không thay đổi số lượng
      handleDelete(id);
    }
  };

  const [otpForm] = Form.useForm();
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpResendDisabled, setIsOtpResendDisabled] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  // Sinh OTP
  const handleGenerateOtp = async (id) => {
    try {
      // Reset countdown
      setCountdown(60); // 60 giây
      setIsOtpResendDisabled(true);
      setPendingDeleteId(id);
      setOtpLoading(true);
      const response = await store.dispatch(generateUpdateOtp({ 'object_id': id, 'object_type' : 'motor', 'type': 'motor_delete'  }));
      if (response?.payload?.success) {
        message.success('Đã gửi mã OTP');
        // setOtpPhone(response.phone);
        setIsOtpModalVisible(true);
      } else {
        message.error(response?.payload?.message || 'Lỗi sinh OTP');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async () => {
    try {
      await otpForm.validateFields();
      setOtpLoading(true);

      const otpValue = otpForm.getFieldValue('otp');
      const response = await store.dispatch(verifyUpdateOtp({
        otp_code: otpValue,
        // phone: otpPhone,
        type: 'motor_delete'
      }));
      if (response.payload?.success) {
        message.success('Xác thực OTP thành công');
        setIsOtpModalVisible(false);
        otpForm.resetFields();
        if (pendingDeleteId) {
          handleDelete(pendingDeleteId); // Xóa sau xác thực thành công
          setPendingDeleteId(null); // reset lại
        }
       
      } else {
        // Xử lý lỗi chi tiết
        const errorMessage = response.payload?.errors
          ? Object.values(response.payload.errors)[0][0]
          : (response.payload?.message || 'Mã OTP không chính xác');

        message.error(errorMessage);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const [countdown, setCountdown] = useState(0);

  // Sửa useEffect countdown
  useEffect(() => {
    let timer = null; // Thay vì NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            setIsOtpResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Cleanup interval khi component unmount
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  const handleExportExcel = async () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const exportUrl = `${baseUrl}/company/api/v1/motor-store-export`;
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
      link.setAttribute("download", "motor.xlsx"); // Tên file tải xuống
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };


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
    // {
    //   title: "Số khung",
    //   dataIndex: "frame_number",
    //   align: "center",
    //   // editable: true,
    //   width: "12.5%",
    //   // render: (record) => record.toLocaleString(),
    // },
    // {
    //   title: "Số máy móc",
    //   dataIndex: "machine_number",
    //   align: "center",
    //   // editable: true,
    //   width: "12.5%",
    // },
    // {
    //   title: "Số bảo hành",
    //   dataIndex: "warranty_number",
    //   align: "center",
    //   // editable: true,
    //   width: "12.5%",
    // },
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
                // onConfirm={() => handleDelete(record.id)}
                onConfirm={() => onDeleteClick(record.id)}
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


  // Modal OTP
  const renderOtpModal = (id) => (
    <Modal
      title="Xác Thực OTP"
      open={isOtpModalVisible}
      onOk={handleVerifyOtp}
      onCancel={() => {
        setIsOtpModalVisible(false);
        setPendingUpdateData(null);
        otpForm.resetFields();
      }}
      confirmLoading={otpLoading}
      okText="Xác Nhận"
      cancelText="Hủy"
    >
      <Form form={otpForm}>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Vui lòng nhập mã OTP' },
            // {
            //   len: 6,
            //   message: 'Mã OTP phải có 6 chữ số'
            // },
            {
              validator: async (_, value) => {
                if (value && !/^\d{6}$/.test(value)) {
                  throw new Error('Mã OTP phải là 6 chữ số');
                }
              }
            }
          ]}
        >
          <Input
            placeholder="Nhập mã OTP 6 chữ số"
            maxLength={6}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Chỉ cho phép nhập số
              otpForm.setFieldValue('otp', inputValue.replace(/\D/g, ''));
            }}
          />
        </Form.Item>
        <Button
          onClick={handleGenerateOtp}
          disabled={isOtpResendDisabled}
        >
          {isOtpResendDisabled
            ? `Gửi lại OTP (${countdown}s)`
            : 'Gửi OTP'}
        </Button>
      </Form>

    </Modal>
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
      <Row justify={"space-between"} gutter={[8, 8]}>
        <Col xl={18} lg={18} md={18} sm>
          <FormAddCarStore currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl={3} lg={3} md={3} sm>
          <ModalImportCarStore currentPage={currentPage} pageSize={pageSize} />
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

        {/* Thêm modal OTP */}
        {renderOtpModal()}
    </div>
  );
}
