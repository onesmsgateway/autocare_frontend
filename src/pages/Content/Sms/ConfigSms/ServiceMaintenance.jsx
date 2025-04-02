import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
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
