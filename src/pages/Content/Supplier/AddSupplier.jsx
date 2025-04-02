import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createSupplier,
  getListSupplier,
} from "../../../services/supplier/supplier";
import { reGexIsNumber, reGexPhone } from "../../../utils/config";
export default function AddSupplier({ currentPage, pageSize }) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await store.dispatch(createSupplier(values));
      if (createSupplier.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm nhà cung cấp thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(getListSupplier({ currentPage, pageSize }));
      } else if (createSupplier.rejected.match(response)) {
        if (response.payload.errors) {
          setIsLoading(false);
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
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
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>

      <Modal
        title="Thêm nhà cung cấp"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addSupplier"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Tên nhà cung cấp"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhà cung cấp",
                  },
                ]}
              >
                <Input placeholder="Tên nhà cung cấp" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ ",
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
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập email ",
                  },
                  {
                    type: "email",
                    message: "Email chưa đúng định dạng!",
                  },
                ]}
                name="email"
                label="Email"
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Mã số thuế"
                name="tax_code"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập mã số thuế",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "Mã số thuế chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Mã số thuế" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập người đại diện ",
                  },
                ]}
                name="delegater"
                label="Người đại diện"
              >
                <Input placeholder="Người đại diện" />
              </Form.Item>
            </Col>
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
