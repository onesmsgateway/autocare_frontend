import { Breadcrumb, Col, Divider, Flex, Radio, Row, Space } from "antd";
import { useRef, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../../../../assets/css/animation.css";
import BirthdayConfiguration from "./BirthdayConfiguration";
import ServiceMaintenance from "./ServiceMaintenance";
// import ChangeOilToKM from "./ChangeOilToKM";
import PeriodicMaintenance from "./PeriodicMaintenance";
import ThankYouBuyingCar from "./ThankYouBuyingCar";
// import CompletePeriodicMaintenance from "./CompletePeriodicMaintenance";
// import MaintenanceForEachTypeOfMaintenance from "./MaintenanceForEachTypeOfMaintenance";
import ChangeOil from "./ChangeOil";
import Maintenance from "./Maintenance";
import { Helmet } from "react-helmet";
import OtherMessages from "./OtherMessages";
import ActiveSms from "../ActiveSms/ActiveSms";
export default function ConfigSms() {
  const [value, setValue] = useState(1);
  const nodeRef = useRef(null);

  return (
    <div>
      <Helmet>
        <title>Cấu hình nhắn tin</title>
        <meta name="description" content="Trang cấu hình auto-care" />
      </Helmet>
      <h2>Cấu hình tin nhắn</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Tin nhắn",
          },
          {
            title: "Cấu hình",
            href: "/settings-sms",
          },
        ]}
      />
      <Radio.Group
        style={{ width: "60%" }}
        buttonStyle="solid"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      >
        <Row gutter={[8, 8]}>
          <Col xl={12} lg={12} md={12} sm={24}>
            <Space direction="vertical">
              <Radio.Button value={1}>
                Nhắn tin chúc mừng sinh nhật
              </Radio.Button>
              <Radio.Button value={2}>Nhắn tin bảo dưỡng định kì</Radio.Button>
              <Radio.Button value={3}>Nhắn tin bảo dưỡng dịch vụ</Radio.Button>
              {/* <Radio.Button value={4}>Nhắn tin cảm ơn mua xe</Radio.Button> */}
            </Space>
          </Col>
          <Col xl={12} lg={12} md={12} sm={24}>
            <Space direction="vertical">
              {/* <Radio.Button value={8}>
                Nhắn tin thay dầu theo thời gian
              </Radio.Button> */}
              <Radio.Button value={9}>Nhắn tin cảm ơn bảo dưỡng</Radio.Button>
              {/* <Radio.Button value={10}>Tin nhắn khác</Radio.Button> */}
              <Radio.Button value={4}>Nhắn tin cảm ơn mua xe</Radio.Button>
            </Space>
          </Col>
        </Row>
      </Radio.Group>

      <Divider />
      <ActiveSms />
      <Divider />
      <Flex justify="center">
        <div
          style={{
            borderRadius: 10,
            boxShadow:
              "rgba(0, 0, 0, 0.5) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 6px 10px",
            padding: 10,
            width: "40%",
          }}
        >
          <SwitchTransition>
            <CSSTransition
              key={value}
              nodeRef={nodeRef}
              classNames="fade"
              timeout={300}
            >
              <div ref={nodeRef} className={`animation-${value}`}>
                {value === 1 ? (
                  <BirthdayConfiguration />
                ) : value === 2 ? (
                  <PeriodicMaintenance />
                ) : value === 3 ? (
                  <ServiceMaintenance />
                ) : value === 4 ? (
                  <ThankYouBuyingCar />
                ) : value === 8 ? (
                  <ChangeOil />
                ) : value === 9 ? (
                  <Maintenance />
                ) : value === 10 ? (
                  <OtherMessages />
                ) : null}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </Flex>
    </div>
  );
}
