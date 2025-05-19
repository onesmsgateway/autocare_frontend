import { forwardRef, useEffect, useState } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip,
  message 
} from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import { reGexLicensePlates } from "../../../utils/config";
import { editMotorStore, getListMotorStore } from "../../../services/motorStore/motorStore";
import { generateUpdateOtp, verifyUpdateOtp } from "../../../services/otp/otp";
import { store } from "../../../redux/configStores";
const { Option } = Select;
const FormEditCarStore = forwardRef(function FormEditCarStore(props, ref) {
  const { currentPage, pageSize, record } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formatValues = (fieldsValue) => {
    return {
      ...fieldsValue,
      day_sale: fieldsValue["day_sale"]?.format("YYYY-MM-DD HH:mm:ss"),
    };
  };
  const {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  } = useEditHandler(
    editMotorStore,
    getListMotorStore,
    dispatch,
    ref,
    currentPage,
    pageSize,
    formatValues
  );
  

  useEffect(() => {
    form.setFieldsValue({
      store_id: updateRecord?.store_id,
      name_bike: updateRecord?.name_bike,
      // license_plate: updateRecord?.license_plate,
      frame_number: updateRecord?.frame_number,
      machine_number: updateRecord?.machine_number,
      maintain_quantity: updateRecord?.maintain_quantity,
      warranty_number: updateRecord?.warranty_number,
      motor_price: updateRecord?.motor_price,
      quantity: updateRecord?.quantity
    });
  }, [updateRecord, form, isModalOpenEdit]);

  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpForm] = Form.useForm();
  const [isOtpResendDisabled, setIsOtpResendDisabled] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);
  // Sinh OTP
  const handleGenerateOtp = async (values) => {
    try {
      // Reset countdown
      setCountdown(60); // 60 giây
      setIsOtpResendDisabled(true);
      setOtpLoading(true);
      const response = await store.dispatch(generateUpdateOtp({ 'object_id': record?.id, 'object_type' : 'motor' }));
      if (response?.payload?.success) {
        message.success('Đã gửi mã OTP');
        // setOtpPhone(response.phone);
        setIsOtpModalVisible(true);
        setPendingUpdateData(values);
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
        type: 'motor_update'
      }));
      if (response.payload?.success) {
        setIsOtpModalVisible(false);
        onFinish(pendingUpdateData);
        message.success('Xác thực OTP thành công');
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

  // Xử lý submit form
  const handleFinish = (values) => {
    const hasInventoryChange =
      values.quantity !== updateRecord.quantity;

    if (hasInventoryChange) {
      // Sinh OTP nếu thay đổi số lượng
      handleGenerateOtp(values);
    } else {
      // Update ngay nếu không thay đổi số lượng
      onFinish(values);
    }
  };

  // Modal OTP
  const renderOtpModal = () => (
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
  
  return (
    <div>
      <Tooltip placement="top" title="Sửa">
        <span
          style={{
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => {
            showModalEdit(record);
          }}
        >
          <EditOutlined />
        </span>
      </Tooltip>

      <Modal
        title="Sửa thông tin xe"
        open={isModalOpenEdit}
        footer={null}
        width={850}
        onCancel={handleCancelEdit}
      >
        <Form
          name="addCar"
          // onFinish={onFinish}
          onFinish={handleFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên xe",
                  },
                ]}
                name="name_bike"
                label="Tên xe"
              >
                <Input placeholder="Tên xe" />
              </Form.Item>
            </Col>
            {/* <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="license_plate"
                label="Biển số"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập biển số xe",
                  },
                  {
                    pattern: reGexLicensePlates,
                    message: "Sai định dạng biển số xe",
                  },
                ]}
              >
                <Input placeholder="Ví dụ : 29C1-99999" />
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Số khung"
                name="frame_number"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số khung",
                  },

                ]}
              >
                <Input placeholder="Số khung" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số máy ",
                  },
                ]}
                name="machine_number"
                label="Số máy"
              >
                <Input placeholder="Số máy" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số bảo hành ",
                  },
                ]}
                name="warranty_number"
                label="Số bảo hành"
              >
                <Input placeholder="Số bảo hành" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng xe",
                  },
                ]}
              >
                <InputNumber placeholder="Số lượng" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="motor_price"
            label="Giá xe"
            rules={[
              {
                required: false,
                message: "Vui lòng nhập số tiền",
              },
            ]}
          >
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Số tiền"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isEditLoading}
              icon={<SyncOutlined />}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
       {/* Thêm modal OTP */}
       {renderOtpModal()}
    </div>
  );
});

FormEditCarStore.displayName = "FormEditCarStore";

export default FormEditCarStore;
