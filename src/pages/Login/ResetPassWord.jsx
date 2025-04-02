import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import BrandLogo from "../../assets/img/BrandLogo.png";
import { store } from "../../redux/configStores";
import { resetPassWord } from "../../services/login/login";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassWord() {
  const [form] = Form.useForm();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const onFinish = async (values) => {
    const data = {
      password: values.password,
      confirm_pass_new: values.confirm_pass_new,
      token: token,
    };
    setLoading(true);
    try {
      const response = await store.dispatch(resetPassWord(data));
      if (response.payload.status === 200) {  
        navigate("/login");
        message.success(response.payload.message);
      } else {
        message.error(response.payload.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <>
      <div className="login">
        <div className="box-login">
          <div className="box-login-container">
            <div className="login-box">
              <div className="title">
                <img style={{ width: 150 }} src={BrandLogo} alt="logo" />
                <h2>AutoCare - Thiết lập mật khẩu</h2>
              </div>
              <div className="form-login">
                <Form
                  name="reset-pass"
                  layout="vertical"
                  onFinish={onFinish}
                  form={form}
                >
                  <Form.Item
                    name="password"
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
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu chưa khớp ")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                    />
                  </Form.Item>
                  <Form.Item style={{ textAlign: "center", margin: "15px 0" }}>
                    <Button
                      style={{
                        padding: "9px 36px",
                        height: "auto",
                        fontSize: "16px",
                        fontWeight: "500",
                        width: "100%",
                      }}
                      disabled={loading}
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Xác nhận
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
