import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "../../assets/img/BrandLogo.png";
import CarLogin from "../../assets/img/undraw_electric_car_b7hl.png";
import { store } from "../../redux/configStores";
import { loginApp } from "../../services/login/login";
import { useSelector } from "react-redux";
export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.login);
  const onFinish = async (values) => {
    try {
      const response = await store.dispatch(loginApp(values));
      if (response.payload.status === 200) {
        if (response.payload.data.type === "ADMIN") {
          navigate("/company");
        } else {
          navigate("/");
        }
        return;
      }
      message.error(response.payload.message);
    } catch (error) {
      message.error("Đăng nhập thất bại");
    }
  };
  return (
    <>
      <div
        className="login"
        style={{
          backgroundImage: `url(${CarLogin})`,
        }}
      >
        <div className="box-login">
          <div className="box-login-container">
            <div className="login-box">
              <div className="title">
                <img style={{ width: 150 }} src={BrandLogo} alt="logo" />
                <h2>AutoCare - Đăng Nhập</h2>
              </div>
              <div className="form-login">
                <Form name="normal_login" onFinish={onFinish} form={form}>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tài khoản",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Tài khoản"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Mật khẩu"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                    />
                  </Form.Item>
                  {loading ? (
                    <Spin tip="Xin chờ" size="large">
                      <div className="content" />
                    </Spin>
                  ) : null}
                  <NavLink className="forgot-password" to="/forgot-password">
                    Quên mật khẩu ?
                  </NavLink>
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
                      icon={<LoginOutlined />}
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Đăng nhập
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
