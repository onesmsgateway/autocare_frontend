import {
  MailOutlined,
  ReloadOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { Button, Form, Input, message, Tabs } from "antd";
// import { NavLink } from "react-router-dom";
import BrandLogo from "../../assets/img/BrandLogo.png";
import { store } from "../../redux/configStores";
import { forgotPassWord, verifyOtp } from "../../services/login/login";
import { useState } from "react";
const { TabPane } = Tabs;

export default function ForgotPassWord() {
  // const [form] = Form.useForm();
  // const [loading, setLoading] = useState();
  
  const [formEmail] = Form.useForm();
  const [formPhone] = Form.useForm();
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [sending, setSending] = useState(false);

  // const onFinish = async (values) => {
  //   setLoading(true);
  //   try {
  //     const response = await store.dispatch(forgotPassWord(values));
  //     setLoading(false);
  //     message.success(response.payload.message);
  //     form.resetFields();
  //   } catch (error) {
  //     setLoading(false);
  //     message.error("Đăng nhập thất bại");
  //   }
  // };
  const onFinishEmail = async (values) => {
    setLoadingEmail(true);
    try {
      // Thực hiện yêu cầu đặt lại mật khẩu bằng email
      const response = await store.dispatch(forgotPassWord(values));
      setLoadingEmail(false);
      message.success(response.payload.message);
      formEmail.resetFields();
    } catch (error) {
      setLoadingEmail(false);
      message.error("Có lỗi sảy ra. Vui lòng thử lại.");
    }
  };

  const onFinishPhone = async (values) => {
    setLoadingPhone(true);
    try {
      const response = await store.dispatch(forgotPassWord(values));
      console.log(response);
      if(response.payload.status === 200){
        message.success(response.payload.message);
        setSending(true);
      }else{
        message.error(response.payload.message);
      }
      setLoadingPhone(false);
    } catch (error) {
      setSending(false);
      setLoadingPhone(false);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const onConfirmPhone = async (values) => {
    try {
      const response = await store.dispatch(verifyOtp(values));
      if (response.payload.code === 200) {
        message.success(response.payload.message);
        formPhone.resetFields();
        window.location.replace(response.payload.link)
      } else {
        message.error(response.payload.message);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="login">
      <div className="box-login">
        <div className="box-login-container">
          <div className="login-box">
            <div className="title">
              <img style={{ width: 150 }} src={BrandLogo} alt="logo" />
              <h2>AutoCare - Quên mật khẩu</h2>
            </div>
            <div className="form-login">
              <Tabs defaultActiveKey="email">
                <TabPane tab="Email" key="email">
                  <Form
                    name="forgot-pass-email"
                    layout="vertical"
                    onFinish={onFinishEmail}
                    form={formEmail}
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
                        disabled={loadingEmail}
                        loading={loadingEmail}
                        icon={<ReloadOutlined />}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Đặt lại mật khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="Số điện thoại" key="phone">
                  <Form
                    name="phone"
                    layout="vertical"
                    onFinish={sending ? onConfirmPhone : onFinishPhone}
                    form={formPhone}
                  >
                    <Form.Item
                      label="Vui lòng nhập số điện thoại"
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
                        name="phone"
                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                        placeholder="Số điện thoại"
                      />
                    </Form.Item>
                    {sending && (
                      <Form.Item
                        label="Vui lòng nhập OTP"
                        name="otp"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập OTP",
                          },
                          {
                            pattern: /^[0-9]{6}$/,
                            message: "OTP chưa đúng định dạng!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="site-form-item-icon" />}
                          placeholder="OTP"
                        />
                      </Form.Item>
                    )}
                    <Form.Item style={{ textAlign: "center", margin: "15px 0" }}>
                      <Button
                        style={{
                          padding: "9px 36px",
                          height: "auto",
                          fontSize: "16px",
                          fontWeight: "500",
                          width: "100%",
                        }}
                        disabled={loadingPhone}
                        loading={loadingPhone}
                        icon={<ReloadOutlined />}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        {sending ? "Xác nhận" : "Gửi OTP"}
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
