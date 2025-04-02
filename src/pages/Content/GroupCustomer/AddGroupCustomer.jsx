import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createGroupCustomer,
  getListGroupCustomer,
} from "../../../services/groupCustomer/groupCustomer";

export default function AddGroupCustomer({ currentPage, pageSize }) {
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
      const response = await store.dispatch(createGroupCustomer(values));
      if (createGroupCustomer.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm nhóm khách hàng thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(getListGroupCustomer({ currentPage, pageSize }));
      } else if (createGroupCustomer.rejected.match(response)) {
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
        title="Thêm nhóm khách hàng"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addProgram"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Form.Item
            label="Tên nhóm"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên nhóm khách hàng",
              },
            ]}
          >
            <Input placeholder="Tên nhóm khách hàng" />
          </Form.Item>

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
