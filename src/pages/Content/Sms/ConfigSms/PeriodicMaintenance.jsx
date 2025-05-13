import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Radio,
  Row,
  Skeleton,
  Switch,
  TimePicker,
  message,
} from "antd";
import Input from "antd/es/input/Input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getListPeriodicMaintenance,
  periodicMaintenance,
} from "../../../../services/sms/sms";
import dayjs from "dayjs";

export default function PeriodicMaintenance() {
  const [form] = Form.useForm();
  const [isLoading, setEditLoading] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await dispatch(getListPeriodicMaintenance());
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
      times_to_km: config?.times_to_km,
      send_day_before: config?.send_day_before,
      sms_maintain_2: config?.sms_maintain_2,
      day_after: config?.day_after,
      time_send: config ? dayjs(config.time_send, "HH:mm:ss") : undefined,
      message_type: config?.message_type || "sms",
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
      const response = await dispatch(periodicMaintenance(data));
      if (periodicMaintenance.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
      } else if (periodicMaintenance.rejected.match(response)) {
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
  const [showDate, setShowDate] = useState(false);
  const handleMaintain2 = (checked) => {
    // console.log(checked);
    if (checked === true) {
      setShowDate(true);
    } else {
      setShowDate(false);
    }
  };
  useEffect(() => {
    if (config?.sms_maintain_2) {
      setShowDate(true);
    } else {
      setShowDate(false);
    }
  }, [config]);
  return (
    <div>
      <h3>Cấu hình tin nhắn bảo dưỡng định kì</h3>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
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
                label="Gửi trước số ngày"
                name="send_day_before"
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
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={24} sm={24}>
              <Form.Item
                label="Tháng nhắn (cách nhau bằng dấu ,)"
                name="send_month_after_buy"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tháng nhắn cách nhau bằng dấu ,",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập tháng nhắn" />
              </Form.Item>
            </Col>
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

          <Form.Item
            label="Nếu khách hàng không đến bảo dưỡng, nhắn tin nhắc lần 2"
            name="sms_maintain_2"
            rules={[
              {
                required: false,
                //   message: "Vui lòng nhập số lần",
              },
            ]}
          >
            <Switch onChange={handleMaintain2} />
          </Form.Item>
          {showDate && (
            <Form.Item
              label="Sau số ngày"
              name="day_after"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tháng nhắn",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<SyncOutlined />}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
