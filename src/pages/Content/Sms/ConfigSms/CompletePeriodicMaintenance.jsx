import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  InputNumber,
  Skeleton,
  TimePicker,
  message,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getListPeriodicMaintenanceAll,
  periodicMaintenanceAll,
} from "../../../../services/sms/sms";
import dayjs from "dayjs";
export default function CompletePeriodicMaintenance() {
  const [form] = Form.useForm();
  const [isLoading, setEditLoading] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await dispatch(getListPeriodicMaintenanceAll());
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
      send_day_before: config?.send_day_before,
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
      const response = await dispatch(periodicMaintenanceAll(data));
      if (periodicMaintenanceAll.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
      } else if (periodicMaintenanceAll.rejected.match(response)) {
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
      <h3>Cấu hình tin nhắn bảo dưỡng định kì toàn bộ</h3>
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
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
          <Form.Item
            label="Tháng nhắn so với lần mua xe"
            name="send_month_after_buy"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn số tháng",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Tháng">
              <Select.Option value={1}>Tháng 1</Select.Option>
              <Select.Option value={2}>Tháng 2</Select.Option>
              <Select.Option value={3}>Tháng 3</Select.Option>
              <Select.Option value={4}>Tháng 4</Select.Option>
              <Select.Option value={5}>Tháng 5</Select.Option>
              <Select.Option value={6}>Tháng 6</Select.Option>
              <Select.Option value={7}>Tháng 7</Select.Option>
              <Select.Option value={8}>Tháng 8</Select.Option>
              <Select.Option value={9}>Tháng 9</Select.Option>
              <Select.Option value={10}>Tháng 10</Select.Option>
              <Select.Option value={11}>Tháng 11</Select.Option>
              <Select.Option value={12}>Tháng 12</Select.Option>
            </Select>
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
