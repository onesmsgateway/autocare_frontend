import { Tabs } from "antd";
import { useSelector } from "react-redux";
import EditPassWord from "./EditPassWord";
import InfoAccount from "./InfoAccount";
import InfoBank from "./InfoBank";

export default function EditUser() {
  const { user } = useSelector((state) => state.user);
  const items = [
    {
      key: "1",
      label: "Thông tin tài khoản",
      children: <InfoAccount />,
    },
    {
      key: "2",
      label: "Bảo mật",
      children: user?.data.type === "WORKSHOP" ? null : <EditPassWord />,
    },
    {
      key: "3",
      label: "Tài khoản nhận tiền",
      children: user?.data.type === "WORKSHOP" ? null : <InfoBank />,
    },
  ];
  return (
    <div className="editUser">
      <h2>Tài khoản của tôi</h2>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
