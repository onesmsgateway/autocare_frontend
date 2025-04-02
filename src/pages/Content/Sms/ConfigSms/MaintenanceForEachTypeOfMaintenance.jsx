import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Select,
  Skeleton,
  TimePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  configTypeMaintenance,
  getListConfigTypeMaintenance,
} from "../../../../services/sms/sms";
import dayjs from "dayjs";
export default function MaintenanceForEachTypeOfMaintenance() {
  const [form] = Form.useForm();
  const [isLoading, setEditLoading] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await dispatch(getListConfigTypeMaintenance());
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
      send_month_after_buy_light: config?.send_month_after_buy_light,
      send_month_after_buy_heavy: config?.send_month_after_buy_heavy,
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
      const response = await dispatch(configTypeMaintenance(data));
      if (configTypeMaintenance.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
      } else if (configTypeMaintenance.rejected.match(response)) {
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
          <h3>Bảo dưỡng nhẹ</h3>
          <Form.Item
            label="Số tháng nhắn tin sau bảo dưỡng nhẹ"
            name="send_month_after_buy_light"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn số tháng",
              },
            ]}
          >
            <Select placeholder="Số tháng">
              <Select.Option value={1}>1 Tháng</Select.Option>
              <Select.Option value={2}>2 Tháng</Select.Option>
              <Select.Option value={3}>3 Tháng</Select.Option>
              <Select.Option value={4}>4 Tháng</Select.Option>
              <Select.Option value={5}>5 Tháng</Select.Option>
              <Select.Option value={6}>6 Tháng</Select.Option>
              <Select.Option value={7}>7 Tháng</Select.Option>
              <Select.Option value={8}>8 Tháng</Select.Option>
              <Select.Option value={9}>9 Tháng</Select.Option>
              <Select.Option value={10}>10 Tháng</Select.Option>
              <Select.Option value={11}>11 Tháng</Select.Option>
              <Select.Option value={12}>12 Tháng</Select.Option>
            </Select>
          </Form.Item>
          <h3>Bảo dưỡng nặng</h3>

          <Form.Item
            label="Số tháng nhắn tin sau bảo dưỡng nặng"
            name="send_month_after_buy_heavy"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn số tháng",
              },
            ]}
          >
            <Select placeholder="Số tháng">
              <Select.Option value={1}>1 Tháng</Select.Option>
              <Select.Option value={2}>2 Tháng</Select.Option>
              <Select.Option value={3}>3 Tháng</Select.Option>
              <Select.Option value={4}>4 Tháng</Select.Option>
              <Select.Option value={5}>5 Tháng</Select.Option>
              <Select.Option value={6}>6 Tháng</Select.Option>
              <Select.Option value={7}>7 Tháng</Select.Option>
              <Select.Option value={8}>8 Tháng</Select.Option>
              <Select.Option value={9}>9 Tháng</Select.Option>
              <Select.Option value={10}>10 Tháng</Select.Option>
              <Select.Option value={11}>11 Tháng</Select.Option>
              <Select.Option value={12}>12 Tháng</Select.Option>
            </Select>
          </Form.Item>
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
