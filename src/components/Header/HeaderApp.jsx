import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Flex,
  message,
  Alert,
  Typography,
  Row,
  Col,
  Drawer,
  Avatar,
  Skeleton,
} from "antd";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { NavLink } from "react-router-dom";
import { persistor, store } from "../../redux/configStores";
import { settings } from "../../utils/config";
// import AutocareImg from "../../assets/img/AnyConv.com__Autocare-Cover-2.png";
import AutocareImg from "../../assets/img/logoAutocare.png";
import { getInfoAccoutBank, getInfoUser } from "../../services/user/user";
import { useSelector } from "react-redux";
import { getAllListAccessarys } from "../../services/accessarys/accessarys";
import {
  getListNotifications,
  updateStatusNotification,
} from "../../services/notifications/notifications";
import { calculateTimeDifference } from "../../utils/dateTime";
export default function HeaderApp() {
  const [notification, setNotification] = useState(false);
  const isAdmin = settings?.getCookie("type") === "ADMIN";
  // const isWorkShop = settings?.getCookie("type") === "WORKSHOP";

  const showNotification = () => {
    setNotification(true);
  };

  const closeNotification = () => {
    setNotification(false);
  };
  const { userData } = useSelector((state) => state.user);
  const { allListAccessarys } = useSelector((state) => state.accessarys);
  const { listNotifications, isLoadlistNotifications } = useSelector(
    (state) => state.notifications
  );
  const checkAccessary = allListAccessarys?.data?.filter(
    (item) => item.inventory_quantity === 0
  );
  const logOut = async () => {
    try {
      // await store.dispatch(logoutUser());
      persistor.pause();
      persistor.flush().then(() => {
        settings.delete_cookie("access_token");
        settings.delete_cookie("type");
        settings.delete_cookie("company_id");
        window.location.assign("/login");
        return persistor.purge();
      });
    } catch (error) {
      message.error(error);
    }
  };
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageSizeScroll, setPageSizeScroll] = useState(5);
  useEffect(() => {
    const fetchData = async () => {
      const response = await store.dispatch(
        getListNotifications({ currentPage: 1, pageSize: pageSizeScroll })
      );
      if (response?.payload?.json?.data?.length < pageSizeScroll) {
        setHasMoreData(false);
      }
    };
    fetchData();
  }, [pageSizeScroll]);
  const handleLoadMore = () => {
    const newPageSize = pageSizeScroll + 5;
    setPageSizeScroll(newPageSize);
  };
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getInfoUser());
      !isAdmin && !isWorkShop && (await store.dispatch(getAllListAccessarys()));
      !isAdmin && !isWorkShop && (await store.dispatch(getInfoAccoutBank()));
    };
    fetchData();
  }, []);

  const handleCheck = async (item) => {
    const data = {
      id: item.id,
      status: true,
    };
    await store.dispatch(updateStatusNotification(data));
    setNotification(false);
    await store.dispatch(
      getListNotifications({ currentPage: 1, pageSize: pageSizeScroll })
    );
  };
  return (
    <>
      <Drawer
        className="notifical"
        title="Thông báo"
        // closable={false}
        onClose={closeNotification}
        open={notification}
      >
        <>
          {listNotifications?.json?.data?.length === 0 ? (
            "Không có thông báo nào"
          ) : (
            <Flex vertical align="center">
              {listNotifications?.json?.data?.map((item, index) => {
                const currentDate = new Date();
                const endDate = item?.created_at;
                const formattedTimeDifference = calculateTimeDifference(
                  currentDate,
                  endDate
                );
                return (
                  <>
                    {isLoadlistNotifications ? (
                      <Skeleton
                        avatar
                        paragraph={{
                          rows: 1,
                        }}
                        active
                      />
                    ) : (
                      <>
                        {" "}
                        <NavLink
                          key={index}
                          className={"box-link"}
                          to={`/detail-vehicle-maintenance/${item.maintain_id}`}
                          onClick={() => {
                            handleCheck(item);
                          }}
                        >
                          <Flex gap={15} align="center">
                            <Avatar
                              style={{ width: 100, height: 50 }}
                              icon={<UserOutlined />}
                              src={item?.sender_avt}
                            />
                            <Typography.Text
                              className={
                                item.status === true
                                  ? "gray-navlink"
                                  : "blue-navlink"
                              }
                            >
                              {item?.content}
                              <Typography.Text
                                style={{
                                  fontSize: 13,
                                  color: "#bfbfbf",
                                  display: "block",
                                }}
                              >
                                {formattedTimeDifference} trước
                              </Typography.Text>
                            </Typography.Text>
                          </Flex>
                        </NavLink>
                      </>
                    )}
                  </>
                );
              })}
              {listNotifications?.json?.data?.length >= 5 && hasMoreData && (
                <Button type="dashed" onClick={handleLoadMore}>
                  Xem thêm
                </Button>
              )}
            </Flex>
          )}
        </>
      </Drawer>
      <Flex gap="middle" align="center" justify="center">
        {userData?.data.type === "WORKSHOP" ? (
          <NavLink to={"/"} style={{ display: "flex" }}>
            <img style={{ width: "117px" }} src={AutocareImg} alt="logo" />
          </NavLink>
        ) : (
          <NavLink to={"/company"} style={{ display: "flex" }}>
            <img style={{ width: "117px" }} src={AutocareImg} alt="logo" />
          </NavLink>
        )}
      </Flex>
      <Row gutter={[8, 8]} style={{ maxWidth: 700 }}>
        <Col xl={24} lg={24} md={24}>
          {" "}
          {!userData?.data.phone && userData?.data.type === "WORKSHOP" && (
            <Alert
              showIcon
              className="responsive-alert-warning"
              closable
              message={
                <span>
                  Vui lòng cập nhật số điện thoại để đăng nhập trên zalo mini
                  app!
                  <NavLink to="/editUser"> Cập nhật ngay</NavLink>
                </span>
              }
              type="info"
            />
          )}
        </Col>
        <Col xl={24} lg={24} md={24}>
          {checkAccessary?.length > 0 && userData?.data.type === "WORKSHOP" && (
            <Alert
              closable
              banner
              className="responsive-alert-warning"
              message={
                <Marquee pauseOnHover gradient={false}>
                  <span>
                    - Cảnh báo những phụ tùng sau đang hết :
                    <NavLink to={"/accessary"}>
                      {" "}
                      {checkAccessary
                        ?.map((item) => item.name_accessary)
                        .join(", ")}
                    </NavLink>
                  </span>
                </Marquee>
              }
            />
          )}
        </Col>
      </Row>

      <Flex
        className="header-content"
        gap={"middle"}
        align="center"
        justify="space-between"
      >
        <Flex
          align="center"
          justify="space-between"
          gap={"middle"}
          className="header_right"
        >
          <Button
            style={{ borderRadius: 50 }}
            type="text"
            onClick={showNotification}
          >
            <Badge count={listNotifications?.count_not_read}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
              </svg>
            </Badge>
          </Button>
          {(userData?.data.type === "WORKSHOP" || userData?.data.type === "MANAGER") && (
            <Typography className="responsive-quota">
              Số Quota còn:{" "}
              <Typography.Text style={{ fontSize: 18 }} strong>
                {userData?.data?.company?.quota?.toLocaleString()}
              </Typography.Text>
            </Typography>
          )}
          <NavLink to={"/editUser"}>{userData?.data.username}</NavLink>
          <Button
            type="primary"
            danger
            onClick={logOut}
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
