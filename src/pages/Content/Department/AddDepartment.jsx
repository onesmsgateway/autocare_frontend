import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createDepartment,
  getListDepartments,
} from "../../../services/department/department";

const { TextArea } = Input;

export default function AddDepartment({ currentPage, pageSize, search }) {
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
    };
    setIsLoading(true);
    try {
      const response = await store.dispatch(createDepartment(values));
      if (createDepartment.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm bộ phận thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(
          getListDepartments({
            currentPage,
            pageSize,
            search,
          })
        );
      } else if (createDepartment.rejected.match(response)) {
        setIsLoading(false);
        if (response?.payload?.response?.data?.errors?.name) {
          message.error(response?.payload?.response?.data?.errors?.name);
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
        title="Thêm bộ phận"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addDepartment"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Tên bộ phận"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên bộ phận",
                  },
                ]}
              >
                <Input placeholder="Tên bộ phận" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Mô tả"
                name="note"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập mô tả bộ phận",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả bộ phận" />
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
