import { LockOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { editPassWord } from "../../../services/user/user";

export default function EditPassWord() {
  // const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState();
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await dispatch(editPassWord(values));
      if (editPassWord.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Cập nhật mật khẩu thành công");
      } else if (editPassWord.rejected.match(response)) {
        setIsLoading(false);
        message.error(response.payload.errors)
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <>
      <Flex justify="center" align="center">
        <div className="boxedituser">
          <Form
            form={form}
            name="editpassword"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="pass_old"
              label="Mật khẩu hiện tại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>
            <Form.Item
              name="pass_new"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>
            <Form.Item
              name="confirm_pass_new"
              label="Nhập lại mật khẩu mới"
              dependencies={["pass_new"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("pass_new") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu chưa khớp "));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  padding: "9px 36px",
                  height: "auto",
                  fontSize: "16px",
                  fontWeight: "500",
                  width: "100%",
                }}
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Flex>
    </>
  );
}
