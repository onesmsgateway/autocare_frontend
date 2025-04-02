import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createDayOff,
  getListDayOffSetting,
} from "../../../services/timekeeping/timekeeping";

export default function AddDayOff({
  currentPage,
  pageSize,
  company_id,
  search,
  optionsLeaveTypeSetting,
  isLoadListLeaveTypeSetting,
  optionsListEmployee,
  isLoadListAllEmployee,
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
      stock: Number(fieldsValue.leave_stock),
    };
    setIsLoading(true);
    try {
      const response = await store.dispatch(createDayOff(values));
      if (createDayOff.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm loại nghỉ thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(
          getListDayOffSetting({
            currentPage,
            pageSize,
            company_id,
            search,
          })
        );
      } else if (createDayOff.rejected.match(response)) {
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
        title="Thêm ngày nghỉ"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addDayOffSetting"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="employee_id"
                label="Nhân viên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn nhân viên",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadListAllEmployee}
                  placeholder="Vui lòng chọn nhân viên"
                  options={optionsListEmployee}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="leave_type_id"
                label="Loại nghỉ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại nghỉ",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadListLeaveTypeSetting}
                  placeholder="Vui lòng chọn loại nghỉ"
                  options={optionsLeaveTypeSetting}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item
              label="Số ngày nghỉ"
              name="leave_stock"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số ngày nghỉ",
                },
              ]}
            >
              <Input placeholder="Số ngày nghỉ" type="number" />
            </Form.Item>
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
