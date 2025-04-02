import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import useAddHandler from "../../../../components/CustomHooks/useAddHandler";
import {
  createCompany,
  getListCompany,
} from "../../../../services/admin/company/company";
const { Option } = Select;
export default function AddCompany({ currentPage, pageSize }) {
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(createCompany, getListCompany, currentPage, pageSize);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm công ty"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addCompany"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên công ty"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công ty",
                  },
                ]}
              >
                <Input placeholder="Tên công ty" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập địa chỉ",
                  },
                ]}
              >
                <Input placeholder="Địa chỉ" />
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
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Key"
                name="secret_key"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập tên công ty",
                  },
                ]}
              >
                <Input placeholder="Mã key" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Người quản lý"
                name="manager_name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập người quản lý",
                  },
                ]}
              >
                <Input placeholder="Người quản lý" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Gói phần mềm"
                name="software_package"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn gói phần mềm",
                  },
                ]}
              >
                <Select allowClear placeholder="Vui lòng chọn gói phần mềm">
                  <Option value="Nhan tin">Nhắn tin</Option>
                  <Option value="Bao duong">Xưởng sữa chữa</Option>
                  <Option value="Full">Đầy đủ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Số tiền nhắn tin BD"
                name="maintain_message_amount"
                rules={[
                  {
                    required: true,
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
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="OA Zns"
                name="oa_zns"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập oa zns",
                  },
                ]}
              >
                <Input placeholder="OA Zns" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="User Zns"
                name="user_zns"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập user zns",
                  },
                ]}
              >
                <Input placeholder="User Zns" />
              </Form.Item>
            </Col>

            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Pass Zns"
                name="pass_zns"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập pass zns",
                  },
                ]}
              >
                <Input.Password placeholder="Pass Zns" />
              </Form.Item>
            </Col>
          </Row>
          <Row><Typography.Text type="secondary" style={{ fontSize: "12px" }}>Thông tin đăng nhập phục vụ cho việc gửi tin nhắn Zalo.</Typography.Text></Row>
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
}
