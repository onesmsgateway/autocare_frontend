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
  message,
} from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import { createStaff, getListStaff } from "../../../services/staff/staff";
import { reGexPhone } from "../../../utils/config";
import { getListMiniDashboardEmployees } from "../../../services/miniDashboard/miniDashboard";
export default function AddStaff({
  currentPage,
  pageSize,
  optionsDepartMent,
  // optionsStore,
  optionsPosition,
  optionsAccountTimekeeping,
  isLoadAccountTimekeeping,
  // isLoadStoresAll,
  isLoadingAllPositions,
  isLoadAllDepartments,
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
      birth_day: fieldsValue["birth_day"]?.format("YYYY-MM-DD"),
      end_user_machine_id: fieldsValue["end_user_machine_id"],
    };
    setIsLoading(true);
    try {
      const response = await store.dispatch(createStaff(values));
      if (createStaff.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm nhân viên thành công");
        handleCancel();
        form.resetFields();
        await store.dispatch(getListStaff({ currentPage, pageSize }));
        await store.dispatch(
          getListMiniDashboardEmployees({ currentPage, pageSize })
        );
      } else if (createStaff.rejected.match(response)) {
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
        title="Thêm nhân viên"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addStaff"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                label="Tên nhân viên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhân viên",
                  },
                ]}
              >
                <Input placeholder="Tên nhân viên" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
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
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
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
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item
                name="department_id"
                label="Bộ phận"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn bộ phận",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadAllDepartments}
                  placeholder="Vui lòng chọn bộ phận"
                  options={optionsDepartMent}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="position_id"
                label="Chức vụ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chức vụ",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadingAllPositions}
                  placeholder="Vui lòng chọn chức vụ"
                  options={optionsPosition}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                label="CCCD"
                name="cccd"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập căn cước công dân",
                  },
                  {
                    pattern: /^[0-9]{12}$/,
                    message: "Số căn cước công dân chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Căn cước công dân" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="end_user_machine_id"
                label="Tài khoản chấm công"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn tài khoản",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadAccountTimekeeping}
                  placeholder="Vui lòng chọn tài khoản"
                  options={optionsAccountTimekeeping}
                />
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
