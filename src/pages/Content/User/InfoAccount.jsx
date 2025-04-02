import {
  AuditOutlined,
  PhoneOutlined,
  UserOutlined,
  SyncOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Flex, Form, Input, message, Skeleton } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInfoUser, updatePhone } from "../../../services/user/user";
import { store } from "../../../redux/configStores";
export default function InfoAccount() {
  const { userData, isLoadUserData } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const onFinish = async (values) => {
    const data = {
      id: userData?.data.id,
      phone: values.phone,
      email: values.email,
    };
    setIsLoading(true);
    // console.log(data)
    try {
      const response = await dispatch(updatePhone(data));
      if (response.payload.data.success === true) {
        setIsLoading(false);
        await store.dispatch(getInfoUser());
        message.success(response.payload.data.message);
      } else {
        setIsLoading(false);
        message.success(response.payload.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const userType = userData?.data.type;
  const userTypeString =
    userType === "WORKSHOP"
      ? "Chủ cửa hàng"
      : userType === "ADMIN"
      ? "Quản trị viên"
      : userType === "STAFF"
      ? "Nhân viên"
      : userType === "MANAGER"
      ? "Quản lý"
      : "Không xác định";

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        username: userData.data.username,
        type: userTypeString,
        phone: userData.data.phone,
        email: userData.data.email,
      });
    }
  }, [userData, form, userTypeString]);

  const [formChanged, setFormChanged] = useState(false);
  const [initialValues] = useState(() => ({
    username: userData?.data.username || "",
    type: userTypeString,
    phone: userData?.data.phone || "",
    email: userData?.data.email || "",
  }));

  const onFieldsChange = useCallback(
    (_, changedFields) => {
      // Kiểm tra xem có thay đổi không
      if (changedFields.length > 0) {
        // Kiểm tra sự khác biệt giữa giá trị hiện tại và giá trị ban đầu
        const isValueChanged = changedFields.some(
          (changedField) =>
            form.getFieldValue(changedField.name) !==
            initialValues[changedField.name]
        );
        setFormChanged(isValueChanged);
      } else {
        setFormChanged(false);
      }
    },
    [form, initialValues]
  );

  return (
    <div>
      <Flex justify="center">
        <div className="boxedituser">
          {isLoadUserData ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              initialValues={initialValues}
              onFieldsChange={onFieldsChange}
              requiredMark="optional"
            >
              <Form.Item
                name="username"
                label="Tên tài khoản"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập username !",
                  },
                ]}
              >
                <Input
                  disabled
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern: /^0[0-9]{9}$/,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email",
                  },
                  {
                    type: "email",
                    message: "Email chưa đúng định dạng!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="type"
                label="Chức vụ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                ]}
              >
                <Input
                  disabled
                  prefix={<AuditOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Button
                style={{
                  padding: "9px 36px",
                  height: "auto",
                  fontSize: "16px",
                  fontWeight: "500",
                  width: "100%",
                }}
                loading={isLoading}
                disabled={isLoading || !formChanged}
                icon={<SyncOutlined />}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Cập nhật
              </Button>
            </Form>
          )}
        </div>
      </Flex>
    </div>
  );
}
