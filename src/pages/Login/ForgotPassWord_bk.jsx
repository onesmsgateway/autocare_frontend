import {
    MailOutlined,
    ReloadOutlined,
  } from "@ant-design/icons";
  import { Button, Form, Input, message } from "antd";
  import { NavLink } from "react-router-dom";
  import BrandLogo from "../../assets/img/BrandLogo.png";
  import { store } from "../../redux/configStores";
  import { forgotPassWord } from "../../services/login/login";
  import { useState } from "react";
  
  export default function ForgotPassWord() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState();
    const onFinish = async (values) => {
      setLoading(true);
      try {
        const response = await store.dispatch(forgotPassWord(values));
        setLoading(false);
        message.success(response.payload.message);
        form.resetFields();
      } catch (error) {
        setLoading(false);
        message.error("Đăng nhập thất bại");
      }
    };
    return (
      <>
        <div
          className="login"
          style={
            {
              // backgroundImage: `url(${CarLogin})`,
            }
          }
        >
          <div className="box-login">
            <div className="box-login-container">
              <div className="login-box">
                <div className="title">
                  <img style={{ width: 150 }} src={BrandLogo} alt="logo" />
                  <h2>AutoCare - Quên mật khẩu</h2>
                </div>
                <div className="form-login">
                  <Form
                    name="forgot-pass"
                    layout="vertical"
                    onFinish={onFinish}
                    form={form}
                  >
                    <Form.Item
                      label="Vui lòng nhập email của bạn"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email của bạn",
                        },
                        {
                          type: "email",
                          message: "Vui lòng nhập đúng định dạng email",
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="site-form-item-icon" />}
                        placeholder="Email"
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
                        icon={<ReloadOutlined />}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Đặt lại mật khẩu
                      </Button>
                      <NavLink
                        style={{
                          textAlign: "center",
                          margin: "15px 0",
                          display: "block",
                        }}
                        to={"/login"}
                      >
                        Quay lại
                      </NavLink>
                      <p>
                        This site is protected by reCAPTCHA and the Google{" "}
                        <NavLink to={"/https://policies.google.com/privacy"}>
                          Privacy Policy
                        </NavLink>{" "}
                        and{" "}
                        <NavLink to={"/https://policies.google.com/terms"}>
                          {" "}
                          Terms of Service
                        </NavLink>{" "}
                        apply.
                      </p>
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
  