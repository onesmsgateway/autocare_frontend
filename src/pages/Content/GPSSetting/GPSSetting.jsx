import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Row,
  Skeleton,
  message,
  Input,
  Modal,
  Image,
} from "antd";
import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { store } from "../../../redux/configStores";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalAddCustomer from "../CarManage/ModalAddCustomer";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getGPS, updateGPS } from "../../../services/timekeeping/timekeeping";

dayjs.extend(duration);

export default function GPSSetting() {
  const navigate = useNavigate();
  const [formAdd] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await store.dispatch(getGPS());

      if (response?.payload?.data) {
        setExistingData(response.payload?.data); // Lưu dữ liệu lấy từ API
        formAdd.setFieldsValue({
          gps_latitude: response?.payload?.data?.gps_latitude,
          gps_longitude: response?.payload?.data?.gps_longitude,
          distance: response?.payload?.data?.distance,
          name_location: response?.payload?.data?.name_location,
        });
      }
    } catch (error) {
      message.error("Không thể lấy dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (fieldsValue) => {
    setIsLoading(true);
    try {
      const values = {
        gps_latitude: fieldsValue["gps_latitude"],
        gps_longitude: fieldsValue["gps_longitude"],
        distance: fieldsValue["distance"],
        name_location: fieldsValue["name_location"],
      };

      if (existingData) {
        const response = await store.dispatch(
          updateGPS({ ...values, id: existingData.id })
        );
        if (updateGPS.fulfilled.match(response)) {
          message.success("Cập nhật thành công");
          await fetchData();
        } else if (updateGPS.rejected.match(response)) {
          setIsLoading(false);
          if (response.payload.errors) {
            Object.keys(response.payload.errors).forEach((field) => {
              const errorMessages = response.payload.errors[field];
              errorMessages.forEach((errorMessage) => {
                message.error(errorMessage);
              });
            });
          }
        }
      } else {
        const response = await store.dispatch(updateGPS(values));
        if (updateGPS.fulfilled.match(response)) {
          message.success("Tạo mới thành công");
          await fetchData();
        } else if (updateGPS.rejected.match(response)) {
          setIsLoading(false);
          if (response.payload.errors) {
            Object.keys(response.payload.errors).forEach((field) => {
              const errorMessages = response.payload.errors[field];
              errorMessages.forEach((errorMessage) => {
                message.error(errorMessage);
              });
            });
          }
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h2>{existingData ? "Cập nhật cài đặt GPS" : "Tạo mới cài đặt GPS"}</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Chấm công",
          },
          {
            title: existingData ? "Cập nhật GPS" : "Cài đặt GPS",
            href: "/gps-setting",
          },
        ]}
      />
      <div className="addCarCustomer">
        <Form
          name="addCar"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          {isLoading ? (
            <Skeleton active paragraph />
          ) : (
            <>
              <Row gutter={[8, 8]}>
                <Col xl={12} lg={12} md={12} sm>
                  <p>
                    {" "}
                    <span style={{ color: "red" }}>*</span>
                    Vị trí Vĩ độ (Latitude)
                  </p>
                  <p style={{ fontSize: "11px", margin: "0 0 8px 8px" }}>
                    Đây là giá trị Vĩ độ dựa theo vị trí thực tế của cửa hàng
                    trên google maps (hướng dẫn bên dưới)
                  </p>
                  <Form.Item
                    name="gps_latitude"
                    // label="Vị trí vĩ độ (Latitude)"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tham số latitude",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} type="number" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm>
                  <p>
                    {" "}
                    <span style={{ color: "red" }}>*</span>
                    Vị trí kinh độ (Longitude)
                  </p>
                  <p style={{ fontSize: "11px", margin: "0 0 8px 8px" }}>
                    Đây là giá trị Kinh độ dựa theo vị trí thực tế của cửa hàng
                    trên google maps (hướng dẫn bên dưới)
                  </p>
                  <Form.Item
                    name="gps_longitude"
                    // label="Vị trí kinh độ (Longitude)"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tham số longitude",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 8]}>
                <Col xl={12} lg={12} md={12} sm>
                  <p>
                    {" "}
                    <span style={{ color: "red" }}>*</span>
                    Khoảng cách (m)
                  </p>
                  <p style={{ fontSize: "11px", margin: "0 0 8px 8px" }}>
                    Đây là khoảng cách đo từ vị trí cửa hàng đến vị trí nhân
                    viên đang đứng cho phép chấm công. ví dụ: 50m
                  </p>
                  <Form.Item
                    name="distance"
                    // label="Khoảng cách (m)"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập khoảng cách",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} type="number" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm>
                  <p style={{ margin: "0 0 24px 8px" }}>
                    {" "}
                    <span style={{ color: "red" }}>*</span>
                    Tên cửa hàng
                  </p>
                  {/* <p style={{ fontSize: "11px", margin: "0 0 8px 8px" }}></p> */}
                  <Form.Item
                    name="name_location"
                    // label="Tên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ margin: "0 0 24px 0" }}>
                <p style={{ fontWeight: 700, fontSize: "13px" }}>Hướng Dẫn:</p>
                <Button
                  size="small"
                  style={{ fontSize: "13px" }}
                  onClick={showModal}
                >
                  Lấy giá trị vĩ độ, kinh độ
                </Button>
              </div>
              <Row>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    icon={<PlusCircleOutlined />}
                  >
                    {existingData ? "Cập nhật" : "Tạo mới"}
                  </Button>
                </Form.Item>
                <Button
                  type="primary"
                  danger
                  onClick={() => navigate("/list-timekeeping")}
                  icon={<CloseCircleOutlined />}
                  style={{ marginLeft: 8 }}
                >
                  Hủy
                </Button>
              </Row>
            </>
          )}
        </Form>
        {/* Modal for showing GPS instructions */}
        <Modal
          title="Hướng dẫn lấy giá trị Vĩ độ và Kinh độ từ Google Maps"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Đóng
            </Button>,
          ]}
        >
          <p>
            1. Mở{" "}
            <a href="https://www.google.com/maps" target="_blank">
              Google Maps{" "}
            </a>{" "}
            và tìm vị trí cửa hàng của bạn.
          </p>
          <Image src="https://wiki.ngoisaoso.vn/uploads/news/2017_08/huong-dan-lay-kinh-do-vi-do-1.jpg" />
          <p>2. Nhấp chuột phải vào vị trí cửa hàng trên bản đồ.</p>
          <p>3. Chọn “What’s here?” hoặc “Có gì ở đây?”</p>
          <Image src="https://wiki.ngoisaoso.vn/uploads/news/2017_08/huong-dan-lay-kinh-do-vi-do-2.jpg" />
          <p>
            4. Giá trị Vĩ độ và Kinh độ sẽ xuất hiện ở phía dưới cùng của màn
            hình.
          </p>
          <p>5. Sao chép các giá trị này và nhập vào các ô tương ứng.</p>
          <Image src="https://wiki.ngoisaoso.vn/uploads/news/2017_08/huong-dan-lay-kinh-do-vi-do-3.jpg" />
        </Modal>
        <ModalAddCustomer formAdd={formAdd} />
      </div>
    </>
  );
}
