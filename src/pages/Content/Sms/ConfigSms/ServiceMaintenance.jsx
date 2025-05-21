import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Skeleton,
  TimePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getListServiceMaintenance,
  serviceMaintenance,
} from "../../../../services/sms/sms";
import dayjs from "dayjs";

export default function ServiceMaintenance() {
  const [form] = Form.useForm();
  const [isLoading, setEditLoading] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await dispatch(getListServiceMaintenance());
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
      send_month_after_buy: config?.send_month_after_buy,
      send_hours: config ? dayjs(config.send_hours, "HH:mm:ss") : undefined,
      message_type: config?.message_type || "sms",
    });
  }, [form, config]);
  const onFinish = async (values) => {
    const data = {
      ...values,
      send_hours: values["send_hours"].format("HH:mm:ss"),
    };
    setEditLoading(true);
    try {
      const response = await dispatch(serviceMaintenance(data));
      if (serviceMaintenance.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        await dispatch(getListServiceMaintenance());
      } else if (serviceMaintenance.rejected.match(response)) {
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
      <h3>Cấu hình tin nhắn bảo dưỡng dịch vụ</h3>
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
              label="Giờ gửi"
              name="send_hours"
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
              label="Sau số tháng nhắn tin dịch vụ"
              name="send_month_after_buy"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn số tháng",
                },
              ]}
            >
              <Input placeholder="Số tháng" />
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
          <Col xl={12} lg={12} md={24} sm={24}>
              
              <Form.Item
                label="Loại tin nhắn"
                name="message_type"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại tin nhắn",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="sms">SMS</Radio>
                  <Radio value="zns">ZNS</Radio>
                </Radio.Group>
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
