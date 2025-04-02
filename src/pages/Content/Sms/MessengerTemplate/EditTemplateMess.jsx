import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { EditOutlined, FileOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Flex,
  Form,
  Menu,
  Modal,
  Select,
  Tooltip,
  message,
} from "antd";
import { MentionsInput, Mention } from "react-mentions";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  createTemplateMess,
  getListTemplateSms,
} from "../../../../services/sms/sms";
import { store } from "../../../../redux/configStores";
const { Option } = Select;
const EditTemplateMess = forwardRef(function EditTemplateMess(props, ref) {
  const { currentPage, pageSize, record } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [updateRecord, setUpdateRecord] = useState();
  const [isEditLoading, setEditLoading] = useState(false);
  const showModalEdit = useCallback((record) => {
    setIsModalOpenEdit(true);
    setUpdateRecord(record); // Cập nhật record khi showModalEdit được gọi
  }, []);
  const handleCancelEdit = useCallback(() => {
    setIsModalOpenEdit(false);
  }, []);
  useImperativeHandle(ref, () => ({
    showModalEdit,
    handleCancelEdit,
  }));
  useEffect(() => {
    if (updateRecord) {
      form.setFieldsValue({
        type: updateRecord.type,
      });
      setParameterValue(updateRecord.content); // Cập nhật giá trị từ record vào state parameterValue
    }
  }, [updateRecord, form]);

  const onFinish = async (values) => {
    if (!parameterValue.trim()) {
      message.error("Vui lòng nhập nội dung tin nhắn ");
      return;
    }
    const updatedValues = {
      id: updateRecord?.id,
      ...values,
      content: parameterValue,
    };
    // console.log("Updated values:", updatedValues);
    setEditLoading(true);
    try {
      const response = await store.dispatch(createTemplateMess(updatedValues));
      if (createTemplateMess.fulfilled.match(response)) {
        setEditLoading(false);
        setParameterValue("");
        await dispatch(getListTemplateSms({ currentPage, pageSize }));
        form.resetFields();
        handleCancelEdit();
        message.success("Thao tác thành công");
      } else if (createTemplateMess.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
          setEditLoading(false);
        }
      }
    } catch (error) {
      setEditLoading(false);
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
      <Tooltip placement="top" title="Sửa">
        <span
          style={{
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => {
            showModalEdit(record);
          }}
        >
          <EditOutlined />
        </span>
      </Tooltip>

      <Modal
        title="Sửa mẫu tin nhắn"
        open={isModalOpenEdit}
        footer={null}
        centered
        onCancel={handleCancelEdit}
      >
        <Form
          form={form}
          name="configsms"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
        >
          <Form.Item
            label="Loại tin nhắn"
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
              loading={isEditLoading}
              type="primary"
              htmlType="submit"
              icon={<SyncOutlined />}
              className="login-form-button"
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

EditTemplateMess.displayName = "EditTemplateMess";

export default EditTemplateMess;
