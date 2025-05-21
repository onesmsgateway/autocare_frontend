import { forwardRef, useEffect, useState } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Tooltip,
  Select,
  Skeleton,
  InputNumber,
  Radio,
  Space,
  message
} from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import { store } from "../../../redux/configStores";
import { getListWareHouse } from "../../../services/warehouse/warehouse";
import { useSelector } from "react-redux";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import {
  editAccessarys,
  getListAccessarys,
} from "../../../services/accessarys/accessarys";
import { reGexIsNumber } from "../../../utils/config";
import { generateUpdateOtp, verifyUpdateOtp } from "../../../services/otp/otp";
const { Option } = Select;
const EditAccessary = forwardRef(function EditAccessary(props, ref) {
  const { listWarehouse, isLoadWarehouse } = useSelector(
    (state) => state.warehouse
  );
  const { currentPage, pageSize, record, optionsSupplier, isLoadAllSupplier } =
    props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  } = useEditHandler(
    editAccessarys,
    getListAccessarys,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListWareHouse);
  const options = listWarehouse?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  // Thêm state để disable nút gửi lại OTP
  const [isOtpResendDisabled, setIsOtpResendDisabled] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);
  const [otpPhone, setOtpPhone] = useState(null); // Thêm state này
  useEffect(() => {
    form.setFieldsValue({
      id: updateRecord?.id,
      code_accessary: updateRecord?.code_accessary,
      warehouse_id: updateRecord?.warehouse_id,
      price: updateRecord?.price,
      name_accessary: updateRecord?.name_accessary,
      unit: updateRecord?.unit,
      inventory_quantity: updateRecord?.inventory_quantity,
      threshold_quantity: updateRecord?.threshold_quantity,
      code_accessary_1: updateRecord?.code_accessary_1,
      replace_code_accessary: updateRecord?.replace_code_accessary,
      name_eng: updateRecord?.name_eng,
      supplier_id: updateRecord?.supplier_id,
      model: updateRecord?.model,
      type: updateRecord?.type,
      pay_money: updateRecord?.pay_money,
    });
  }, [updateRecord, form, isModalOpenEdit]);

  // Sinh OTP
  const handleGenerateOtp = async (values) => {
    try {
      // Reset countdown
      setCountdown(60); // 60 giây
      setIsOtpResendDisabled(true);
      setOtpLoading(true);
      const response = await store.dispatch(generateUpdateOtp({ 'object_id': record?.id, 'object_type' : 'accessary' }));
      if (response?.payload?.success) {
        message.success('Đã gửi mã OTP');
        setOtpPhone(response.phone);
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
        type: 'accessary_update'
      }));
      console.log('response verify', response);
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
      values.inventory_quantity !== updateRecord.inventory_quantity;

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
        title="Sửa phụ tùng"
        open={isModalOpenEdit}
        footer={null}
        width={850}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editAccessary"
          // onFinish={onFinish}
          onFinish={handleFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã phụ tùng ",
                  },
                ]}
                name="code_accessary"
                label="Mã phụ tùng"
              >
                <Input placeholder="Mã phụ tùng" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên"
                name="name_accessary"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên",
                  },
                ]}
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Kho hàng"
                name="warehouse_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kho hàng",
                  },
                ]}
              >
                <Select
                  allowClear
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  // onSearch={(value) => {
                  //   if (value.match(/^0[0-9]{9}$/)) {
                  //     handleSearch(value);
                  //   }
                  // }}
                  onClear={() => {
                    store.dispatch(
                      getListWareHouse({
                        currentPage: 1,
                        pageSize: pageSizeScroll,
                        value: null,
                      })
                    );
                  }}
                  loading={isLoadWarehouse}
                  placeholder="Vui lòng chọn kho hàng"
                  onPopupScroll={handlePopupScroll}
                >
                  {options?.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                  {loadingScroll && (
                    <Option key="loading" disabled>
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Đơn vị tính"
                name="unit"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị tính",
                  },
                ]}
              >
                <Input placeholder="Đơn vị tính" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Số lượng"
                name="inventory_quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "Số lượng chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Số lượng" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn giá",
                  },
                ]}
                name="price"
                label="Đơn giá"
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Tiền công"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                name="supplier_id"
                label="Nhà cung cấp"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn cửa hàng",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadAllSupplier}
                  placeholder="Vui lòng chọn cửa hàng"
                  options={optionsSupplier}
                />
              </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập ngưỡng số lượng",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "Ngưỡng số lượng chưa đúng định dạng!",
                  },
                ]}
                name="threshold_quantity"
                label="Ngưỡng số lượng"
              >
                <Input placeholder="Ngưỡng số lượng" />
              </Form.Item>
            </Col> */}
            <Col sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn loại  ",
                  },
                ]}
                name="type"
                label="Loại"
              >
                <Radio.Group>
                  <Space direction="horizontal">
                    <Radio value={"PhuTung"}>Phụ tùng</Radio>
                    <Radio value={"PhuKien"}>Phụ kiện</Radio>
                    <Radio value={"VatTu"}>Vật tư</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập tên tiếng anh",
                  },
                ]}
                name="name_eng"
                label="Tên tiếng anh"
              >
                <Input placeholder="Tên tiếng anh" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Model"
                name="model"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập model",
                  },
                ]}
              >
                <Input placeholder="Model" />
              </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tiền trả thợ"
                name="pay_money"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập tiền trả nợ",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Tiền công"
                />
              </Form.Item>
            </Col> */}
          </Row>
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

EditAccessary.displayName = "EditAccessary";

export default EditAccessary;


