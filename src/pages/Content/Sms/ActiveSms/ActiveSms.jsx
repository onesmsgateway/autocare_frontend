import { CheckCircleFilled, SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Modal, Row, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { store } from "../../../../redux/configStores";
import { activeSms, getActiveSms } from "../../../../services/sms/activeSms";
import { useSelector } from "react-redux";

export default function ActiveSms() {
  const { listActiveSms, isLoadigSmsActive } = useSelector(
    (state) => state.sms
  );
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCheckAll = (checked) => {
    form.setFieldsValue({
      bao_duong_dinh_ki: checked,
      bao_duong_dinh_ki_toan_bo: checked,
      bao_duong_dich_vu: checked,
      cam_on_mua_xe: checked,
      cam_on_bao_duong: checked,
      chuc_mung_sinh_nhat: checked,
      thay_dau: checked,
      thay_dau_theo_so_km: checked,
      bao_duong_nang: checked,
      bao_duong_nhe: checked,
      kt_nhong_xich: checked,
      kt_lam_may: checked,
    });
    setIsCheckedAll(checked);
  };
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await store.dispatch(activeSms(values));
      if (activeSms.fulfilled.match(response)) {
        setIsLoading(false);
        // handleCancel();
        form.resetFields();
        setIsCheckedAll(false);
        await store.dispatch(getActiveSms());
        message.success("Cấu hình thành công");
      } else if (activeSms.rejected.match(response)) {
        setIsLoading(false);
        if (response.payload.errors) {
          setIsLoading(false);
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    store.dispatch(getActiveSms());
  }, []);
  useEffect(() => {
    if (listActiveSms && isModalOpen) {
      form.setFieldsValue({
        bao_duong_dinh_ki: listActiveSms.bao_duong_dinh_ki,
        bao_duong_dinh_ki_toan_bo: listActiveSms.bao_duong_dinh_ki_toan_bo,
        bao_duong_dich_vu: listActiveSms.bao_duong_dich_vu,
        cam_on_mua_xe: listActiveSms.cam_on_mua_xe,
        cam_on_bao_duong: listActiveSms.cam_on_bao_duong,
        chuc_mung_sinh_nhat: listActiveSms.chuc_mung_sinh_nhat,
        thay_dau: listActiveSms.thay_dau,
        thay_dau_theo_so_km: listActiveSms.thay_dau_theo_so_km,
        bao_duong_nang: listActiveSms.bao_duong_nang,
        bao_duong_nhe: listActiveSms.bao_duong_nhe,
        kt_nhong_xich: listActiveSms.kt_nhong_xich,
        kt_lam_may: listActiveSms.kt_lam_may,
      });
    }
  }, [form, listActiveSms, isModalOpen]);
  return (
    <div>
      <Button
        type="primary"
        style={{
          padding: "9px 36px",
          height: "auto",
          fontSize: "16px",
          fontWeight: "500",
          backgroundColor: "#52c41a",
        }}
        onClick={showModal}
        icon={<CheckCircleFilled />}
      >
        Kích hoạt gửi tin nhắn
      </Button>
      <Modal
        forceRender
        title="Kích hoạt gửi tin nhắn"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="sentmessage"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          {isLoadigSmsActive && (
            <Spin tip="Loading">
              <div className="content" />
            </Spin>
          )}
          <Form.Item>
            <Checkbox
              checked={isCheckedAll}
              onChange={(e) => handleCheckAll(e.target.checked)}
            >
              Tất cả
            </Checkbox>
          </Form.Item>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item
                name="bao_duong_dinh_ki"
                valuePropName="checked"
                required={false}
              >
                <Checkbox>Bảo dưỡng định kì</Checkbox>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              {/* <Form.Item
                name="bao_duong_dinh_ki_toan_bo"
                valuePropName="checked"
              >
                <Checkbox>Bảo dưỡng định kì toàn bộ</Checkbox>
              </Form.Item> */}
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item name="bao_duong_dich_vu" valuePropName="checked">
                <Checkbox>Bảo dưỡng dịch vụ</Checkbox>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item name="cam_on_mua_xe" valuePropName="checked">
                <Checkbox>Cảm ơn mua xe</Checkbox>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item name="cam_on_bao_duong" valuePropName="checked">
                <Checkbox>Cảm ơn bảo dưỡng</Checkbox>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item name="chuc_mung_sinh_nhat" valuePropName="checked">
                <Checkbox>Chúc mừng sinh nhật</Checkbox>
              </Form.Item>
            </Col>
            {/* <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item name="thay_dau" valuePropName="checked">
                <Checkbox>Thay dầu</Checkbox>
              </Form.Item>
            </Col> */}
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              {/* <Form.Item name="thay_dau_theo_so_km" valuePropName="checked">
                <Checkbox>Thay dầu theo số KM</Checkbox>
              </Form.Item> */}
            </Col>
            {/* <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item name="bao_duong_nang" valuePropName="checked">
                <Checkbox>Bảo dượng nặng</Checkbox>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item name="bao_duong_nhe" valuePropName="checked">
                <Checkbox>Bảo dưỡng nhẹ</Checkbox>
              </Form.Item>
            </Col> */}
            {/* <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item name="kt_nhong_xich" valuePropName="checked">
                <Checkbox>Kiểm tra nhông xích</Checkbox>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              {" "}
              <Form.Item name="kt_lam_may" valuePropName="checked">
                <Checkbox>Kiểm tra làm máy</Checkbox>
              </Form.Item>
            </Col> */}
          </Row>
          <Form.Item>
            <Button
              type="primary"
              style={{
                padding: "9px 36px",
                height: "auto",
                fontSize: "16px",
                fontWeight: "500",
                width: "100%",
              }}
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
              icon={<SyncOutlined />}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
