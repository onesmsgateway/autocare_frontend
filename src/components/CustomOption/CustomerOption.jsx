import { UserOutlined } from "@ant-design/icons";
import { Flex } from "antd";

export default function CustomerOption({ avatar, full_name, phone, address }) {
  // console.log(avatar);
  return (
    <Flex align="center" gap={10} justify="flex-start">
      {avatar ? (
        <img
          style={{ width: 60, height: 60, borderRadius: 50 }}
          src={`${import.meta.env.VITE_API_URL}/${avatar}`}
          alt=""
        />
      ) : (
        <UserOutlined
          style={{
            fontSize: 20,
            color: "#fff",
            borderRadius: 50,
            background: "rgba(0, 0, 0, 0.25)",
            padding: 20,
          }}
        />
      )}
      <Flex vertical>
        <p>{full_name} </p>
        <p>{phone}</p>
        <p>{address}</p>
      </Flex>
    </Flex>
  );
}
