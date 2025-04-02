import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Modal,
  Select,
  Skeleton,
  message,
  Radio,
  Space,
  Flex,
  Dropdown,
  Menu,
} from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import { getListSms, sentSms } from "../../../services/sms/sms";
import { useSelector } from "react-redux";
import { getListCustomer } from "../../../services/customer/customer";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { Mention, MentionsInput } from "react-mentions";
import { getInfoUser } from "../../../services/user/user";
const { Option } = Select;
export default function SentSms({ currentPage, pageSize }) {
  const { listCustomer, loading } = useSelector((state) => state.customer);
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer);
  const options = listCustomer?.data.map((item) => {
    return {
      label: item?.full_name,
      value: item?.phone,
    };
  });
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isLoadSentSms, setIsLoadSentSms] = useState();
  const onFinish = async (values) => {
    if (!parameterValue.trim()) {
      message.error("Vui lòng nhập nội dung tin nhắn ");
      return;
    }
    const updatedValues = {
      ...values,
      message: parameterValue,
    };
    // console.log("Updated values:", updatedValues);
    setIsLoadSentSms(true);
    try {
      const response = await store.dispatch(sentSms(updatedValues));
      if (sentSms.fulfilled.match(response)) {
        setIsLoadSentSms(false);
        setParameterValue("");
        form.resetFields();
        handleCancel();
        message.success("Thao tác thành công");
        await store.dispatch(getListSms({ currentPage, pageSize }));
        await store.dispatch(getInfoUser());
      } else if (sentSms.rejected.match(response)) {
        setIsLoadSentSms(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
          setIsLoadSentSms(false);
        }
      }
    } catch (error) {
      setIsLoadSentSms(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const variableLabels = [
    { display: "Tên khách hàng", id: "TenKH" },
    { display: "Số lần bảo dưỡng", id: "SolanBD" },
    { display: "Ngày sinh", id: "NgaySinh" },
    { display: "Thương hiệu", id: "ThuongHieu" },
    { display: "Tên xe", id: "TenXe" },
    { display: "Biển số", id: "BienSo" },
    { display: "Số khung", id: "SoKhung" },
    { display: "Số máy", id: "SoMay" },
    { display: "Số điện thoại", id: "SoDienThoai" },
    { display: "Ngày bảo dưỡng", id: "NgayBaoDuong" },
    { display: "Ngày mua xe", id: "NgayMuaXe" },
  ];
  const [parameterValue, setParameterValue] = useState("");
  const [showVariables, setShowVariables] = useState(false);
  const handleParameterClick = () => {
    setShowVariables(!showVariables);
  };

  const handleVariableClick = (variable) => {
    const newValue = parameterValue
      ? `${parameterValue} [${variable.id}]`
      : `[${variable.id}]`; // Đảm bảo thêm dấu {} vào biến id
    setParameterValue(newValue); // Loại bỏ dấu cách ở đầu và cuối chuỗi
    setShowVariables(false);
  };
  const menu = (
    <Menu>
      {variableLabels.map((variable, index) => (
        <Menu.Item key={index} onClick={() => handleVariableClick(variable)}>
          {variable.display}
        </Menu.Item>
      ))}
    </Menu>
  );
  const handleSearch = (value) => {
    if (!value) return;
    try {
      store.dispatch(
        getListCustomer({ currentPage: 1, pageSize: pageSizeScroll, value })
      );
    } catch (error) {
      console.error("Error occurred while searching:", error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Gửi tin nhắn
      </Button>
      <Modal
        title="Gửi tin nhắn"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="sentmessage"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Form.Item
            name="phone"
            label="Chọn khách hàng"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn khách hàng",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              mode="multiple"
              maxTagCount="responsive"
              virtual
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase()) ||
                option?.value?.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                optionA?.label
                  ?.toLowerCase()
                  .localeCompare(optionB?.label?.toLowerCase())
              }
              onSearch={(value) => {
                if (value.match(/^0[0-9]{9}$/)) {
                  handleSearch(value);
                }
              }}
              onClear={() => {
                store.dispatch(
                  getListCustomer({
                    currentPage: 1,
                    pageSize: pageSizeScroll,
                    value: null,
                  })
                );
              }}
              loading={loading}
              placeholder="Vui lòng chọn khách hàng"
              onPopupScroll={handlePopupScroll}
            >
              {options?.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
              {loadingScroll && (
                <Option key="loading" disabled>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại tin nhắn ",
              },
            ]}
            name="type"
            label="Loại"
          >
            <Radio.Group>
              <Space direction="horizontal">
                <Radio value={0}>Không dấu</Radio>
                <Radio value={1}>Có dấu</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Flex justify="flex-end">
            <Dropdown overlay={menu} trigger={"click"} placement="top">
              <Button type="link" onClick={handleParameterClick}>
                <FileOutlined /> Tham số
              </Button>
            </Dropdown>
          </Flex>
          <MentionsInput
            style={{ padding: "25px 0", marginBottom: "10px" }}
            value={parameterValue}
            onChange={(e) => setParameterValue(e.target.value)}
            placeholder="Viết gì đó...."
            className="mentions"
          >
            <Mention
              trigger="@"
              data={variableLabels}
              markup="[__id__]"
              appendSpaceOnAdd={true}
              renderSuggestion={(
                suggestion,
                search,
                highlightedDisplay,
                index
              ) => (
                <div className="custom-mentions" key={index}>
                  {highlightedDisplay} {/* Display the suggestion */}
                </div>
              )}
              className="mentions__mention"
              // displayTransform={(id, display) => `${display}`}
            />
          </MentionsInput>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadSentSms}
              icon={<PlusCircleOutlined />}
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
