import {
  Button,
  Dropdown,
  Flex,
  Form,
  Menu,
  Modal,
  Select,
  message,
} from "antd";
import { useState } from "react";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { MentionsInput, Mention } from "react-mentions";
import { store } from "../../../../redux/configStores";
import { createTemplateMess, getListTemplateSms } from "../../../../services/sms/sms";

const { Option } = Select;

export default function FormAddMessenerTemplate({ currentPage, pageSize }) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isLoadSentSms, setIsLoadSentSms] = useState();
  const onFinish = async (values) => {
    if (!parameterValue.trim()) {
      message.error("Vui lòng nhập nội dung tin nhắn ");
      return;
    }
    const updatedValues = { ...values, content: parameterValue };
    // console.log("Updated values:", updatedValues);
    setIsLoadSentSms(true);
    try {
      const response = await store.dispatch(createTemplateMess(updatedValues));
      if (createTemplateMess.fulfilled.match(response)) {
        setIsLoadSentSms(false);
        setParameterValue("");
        form.resetFields();
        handleCancel()
        message.success("Thao tác thành công");
        await store.dispatch(getListTemplateSms({ currentPage, pageSize }));
      } else if (createTemplateMess.rejected.match(response)) {
        setIsLoadSentSms(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
          setIsLoadSentSms(false);
        }
      }
    } catch (error) {
      setIsLoadSentSms(false);
      message.error(
        "Vui lòng cập nhật số điện thoại cho tài khoản để sử dụng tính năng này"
      );
    }
  };
  const variableLabels = [
    { display: "Tên khách hàng", id: "TenKH" },
    { display: "Số lần bảo dưỡng", id: "SolanBD" },
    { display: "Ngày sinh", id: "NgaySinh" },
    { display: "Thương hiệu", id: "ThuongHieu" },
    { display: "Tên xe", id: "TenXe" },
    { display: "Biển số", id: "BienSo" },
    { display: "Số khung", id: "SoKhung" },
    { display: "Số máy", id: "SoMay" },
    { display: "Số điện thoại", id: "SoDienThoai" },
    { display: "Ngày bảo dưỡng", id: "NgayBaoDuong" },
    { display: "Ngày mua xe", id: "NgayMuaXe" },
  ];
  const [parameterValue, setParameterValue] = useState("");
  const [showVariables, setShowVariables] = useState(false);
  const handleParameterClick = () => {
    setShowVariables(!showVariables);
  };

  const handleVariableClick = (variable) => {
    const newValue = parameterValue
      ? `${parameterValue} [${variable.id}]`
      : `[${variable.id}]`; // Đảm bảo thêm dấu {} vào biến id
    setParameterValue(newValue); // Loại bỏ dấu cách ở đầu và cuối chuỗi
    setShowVariables(false);
  };
  const menu = (
    <Menu>
      {variableLabels.map((variable, index) => (
        <Menu.Item key={index} onClick={() => handleVariableClick(variable)}>
          {variable.display}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm mẫu tin nhắn"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="configsms"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
        >
          <Form.Item
            label="Loại cấu hình"
            name="type"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại tin nhắn",
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn loại tin nhắn">
              <Option value="BaoDuongDinhKy">Bảo Dưỡng Định Kì</Option>
              <Option value="BaoDuongDichVu">Bảo Dưỡng Dịch Vụ</Option>
              <Option value="CamOnMuaXe">Cảm ơn mua xe</Option>
              <Option value="CamOnBaoDuong">Cảm ơn bảo dưỡng</Option>
              <Option value="ChucMungSinhNhat">Chúc mừng sinh nhật</Option>
              {/* <Option value="ThayDau">Thay dầu</Option> */}
              {/* <Option value="KTNhongXich">Kiểm tra nhông xích</Option>
              <Option value="KTLamMay">Kiểm tra làm máy</Option> */}
            </Select>
          </Form.Item>
          <Flex justify="flex-end">
            <Dropdown overlay={menu} trigger={"click"} placement="top">
              <NavLink onClick={handleParameterClick}>
                <FileOutlined /> Tham số
              </NavLink>
            </Dropdown>
          </Flex>
          <MentionsInput
            style={{ padding: "25px 0", marginBottom: "10px" }}
            value={parameterValue}
            onChange={(e) => setParameterValue(e.target.value)}
            placeholder="Viết gì đó...."
            className="mentions"
          >
            <Mention
              trigger="@"
              data={variableLabels}
              markup="[__id__]"
              appendSpaceOnAdd={true}
              renderSuggestion={(
                suggestion,
                search,
                highlightedDisplay,
                index
              ) => (
                <div className="custom-mentions" key={index}>
                  {highlightedDisplay} {/* Display the suggestion */}
                </div>
              )}
              className="mentions__mention"
              displayTransform={(id, display) => `[${display}]`}
            />
          </MentionsInput>
          <Form.Item>
            <Button
              style={{
                padding: "9px 36px",
                height: "auto",
                fontSize: "16px",
                fontWeight: "500",
                width: "100%",
              }}
              loading={isLoadSentSms}
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
              className="login-form-button"
            >
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
