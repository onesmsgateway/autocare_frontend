import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createLeaveType,
  getListLeaveTypeSetting,
} from "../../../services/timekeeping/timekeeping";

const { TextArea } = Input;

export default function AddLeaveType({
  currentPage,
  pageSize,
  company_id,
  search,
}) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (fieldsValue) => {
    const values = {
      ...fieldsValue,
      company_id: company_id,
    };
    setIsLoading(true);
    try {
      const response = await store.dispatch(createLeaveType(values));
      if (createLeaveType.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm loại nghỉ thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(
          getListLeaveTypeSetting({
            currentPage,
            pageSize,
            company_id,
            search,
          })
        );
      } else if (createLeaveType.rejected.match(response)) {
        setIsLoading(false);
        if (response.payload.error) {
          message.error(response.payload.error);
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
        title="Thêm loại nghỉ"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addLeaveTypeSetting"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Tên loại nghỉ"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại nghỉ",
                  },
                ]}
              >
                <Input placeholder="Tên loại nghỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả loại nghỉ",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả loại nghỉ" />
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
