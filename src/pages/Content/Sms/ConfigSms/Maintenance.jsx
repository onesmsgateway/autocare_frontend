import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Skeleton,
  TimePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getListThankyouMaintenance,
  thankyouMaintenance,
} from "../../../../services/sms/sms";
import dayjs from "dayjs";

export default function Maintenance() {
  const [form] = Form.useForm();
  const [isLoading, setEditLoading] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await dispatch(getListThankyouMaintenance());
        setLoading(false);
        setConfig(res.payload.data);
      } catch (error) {
        setLoading(false);
        console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    form.setFieldsValue({
      send_day_after_caring: config?.send_day_after_caring,
      time_send: config ? dayjs(config.time_send, "HH:mm:ss") : undefined,
    });
  }, [form, config]);
  const onFinish = async (values) => {
    const data = {
      ...values,
      time_send: values["time_send"].format("HH:mm:ss"),
    };
    console.log(data);
    setEditLoading(true);
    try {
      const response = await dispatch(thankyouMaintenance(data));
      if (thankyouMaintenance.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
      } else if (thankyouMaintenance.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      setEditLoading(false);
    }
  };
  return (
    <div>
      <h3>Cấu hình nhắn tin cảm ơn bảo dưỡng</h3>
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <Form
          name=""
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={24} sm={24}>
              <Form.Item
                label="Giờ nhắn"
                name="time_send"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giờ gửi",
                  },
                ]}
              >
                <TimePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24}>
              <Form.Item
                label="Nhắn sau khi bảo dưỡng"
                name="send_day_after_caring"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số ngày",
                  },
                ]}
              >
                <InputNumber placeholder="Số ngày" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<SyncOutlined />}
            >
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
