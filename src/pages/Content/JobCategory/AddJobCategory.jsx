import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import useAddHandler from "../../../components/CustomHooks/useAddHandler";
import {
  createJobCateGory,
  getListJobCateGory,
} from "../../../services/jobCateGory/jobCateGory";
export default function AddJobCategory({ currentPage, pageSize }) {
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(createJobCateGory, getListJobCateGory, currentPage, pageSize);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm công việc"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="addJobCategory"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công việc ",
                  },
                ]}
                name="name"
                label="Tên công việc"
              >
                <Input placeholder="Nội dung công việc" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiền công ",
                  },
                ]}
                name="wage"
                label="Tiền công"
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
          <Form.Item
            rules={[
              {
                required: false,
                message: "Vui lòng nhập ghi chú ",
              },
            ]}
            name="note"
            label="
            Ghi chú"
          >
            <Input.TextArea placeholder="Ghi chú" />
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
