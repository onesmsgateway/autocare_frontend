import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  // message,
} from "antd";
// import { useState } from "react";
// import { store } from "../../../redux/configStores";
import {
  createCustomer,
  getListCustomer,
} from "../../../services/customer/customer";
import useAddHandler from "../../../components/CustomHooks/useAddHandler";
import { reGexIsNumber, reGexPhone } from "../../../utils/config";
import { getListMiniDashboardCustomers } from "../../../services/miniDashboard/miniDashboard";

const { Option } = Select;
export default function AddCustomer(props) {
  const { currentPage, pageSize, optionGroupCustomer, isLoadingAll } = props;

  const formatValues = (fieldsValue) => {
    return {
      ...fieldsValue,
      birth_day: fieldsValue["birth_day"]
        ? fieldsValue["birth_day"].format("YYYY-MM-DD")
        : null,
    };
  };
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(
      createCustomer,
      getListCustomer,
      currentPage,
      pageSize,
      formatValues, // Truyền hàm format dữ liệu vào custom hook
      getListMiniDashboardCustomers
    );
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>

      <Modal
        title="Thêm khách hàng"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addCustomer"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
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
                    pattern: reGexPhone,
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
                    required: false,
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
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="CMND/CCCD"
                name="citizen_identification"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập CMND/CCCD",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "CMND/CCCD chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Căn cước công dân" />
              </Form.Item>
            </Col>
            {/* <Col xl={12} lg={12} md={12} sm>
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
                  options={optionGroupCustomer}
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
          </Row>
          <Row>
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
            <Button
              type="primary"
              danger
              onClick={handleCancel}
              icon={<CloseCircleOutlined />}
              style={{ marginLeft: 8 }}
            >
              Hủy
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
