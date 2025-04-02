import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createCategoryPost,
  getListCategoryPost,
} from "../../../services/post/post";

const { TextArea } = Input;

export default function AddCategoryPost({
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
      const response = await store.dispatch(createCategoryPost(values));
      if (createCategoryPost.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm loại bài viết thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(
          getListCategoryPost({
            currentPage,
            pageSize,
            search,
          })
        );
      } else if (createCategoryPost.rejected.match(response)) {
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
        title="Thêm loại bài viết"
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
                label="Tên loại bài viết"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại bài viết",
                  },
                ]}
              >
                <Input placeholder="Tên loại bài viết" />
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
                    message: "Vui lòng nhập mô tả loại bài viết",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả loại bài viết" />
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
