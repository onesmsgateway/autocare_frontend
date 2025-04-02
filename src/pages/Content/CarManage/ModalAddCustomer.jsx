import { forwardRef, useImperativeHandle, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import { useSelector } from "react-redux";
import {
  createCustomer,
  getListCustomer,
} from "../../../services/customer/customer";
import { store } from "../../../redux/configStores";
const { Option } = Select;
const ModalAddCustomer = forwardRef(function ModalAddCustomer(props, ref) {
  const { formAdd, formRef } = props;
  const { allListgroupCustomer, isLoadingAll } = useSelector(
    (state) => state.groupCustomer
  );
  const options = allListgroupCustomer?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useImperativeHandle(ref, () => ({
    showModal,
    handleCancel,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    const data = {
      ...values,
      birth_day: values["birth_day"].format("YYYY-MM-DD"),
    };
    setIsLoading(true);
    try {
      const response = await store.dispatch(createCustomer(data));
      if (createCustomer.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm thành công");
        handleCancel();
        formRef.resetFields();
        const response = await store.dispatch(
          getListCustomer({ currentPage: 1, pageSize: 1, value: null })
        );
        formAdd.setFieldsValue({
          customer_id: response?.payload?.data[0]?.id,
        });
      } else if (createCustomer.rejected.match(response)) {
        setIsLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(errorMessage);
            });
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <Modal
        title="Thêm khách hàng mới"
        open={isModalOpen}
        footer={null}
        width={650}
        centered
        onCancel={handleCancel}
      >
        <Form
          name="addCustomerNew"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formRef}
        >
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên khách hàng"
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khách hàng",
                  },
                ]}
              >
                <Input placeholder="Tên khách hàng" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern: /^0[0-9]{9}$/,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính",
                  },
                ]}
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Vui lòng chọn giới tính">
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Ngày sinh"
                name="birth_day"
                rules={[
                  {
                    type: "object",
                    required: true,
                    message: "Vui lòng chọn ngày sinh",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn loại bảo dưỡng",
                  },
                ]}
                name="category"
                label="Loại bảo dưỡng"
              >
                <Select placeholder="Vui lòng chọn loại bảo dưỡng">
                  <Option value="maintain">Bảo dưỡng</Option>
                  <Option value="service">Dịch vụ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="CMND/CCCD"
                name="citizen_identification"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập CMND",
                  },
                ]}
              >
                <Input placeholder="Căn cước công dân" />
              </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Nhóm khách hàng"
                name="group_id"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn khách hàng",
                  },
                ]}
              >
                <Select
                  showSearch
                  options={options}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  virtual
                  loading={isLoadingAll}
                  disabled={isLoadingAll}
                  placeholder="Vui lòng chọn nhóm khách hàng"
                />
              </Form.Item>
            </Col> */}
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập địa chỉ",
                  },
                ]}
                name="address"
                label="Địa chỉ"
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<PlusCircleOutlined />}
            >
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

ModalAddCustomer.displayName = "ModalAddCustomer";

export default ModalAddCustomer;
