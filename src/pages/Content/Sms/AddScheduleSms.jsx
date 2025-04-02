import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  createScheduleSms,
  getListScheduleSms,
} from "../../../services/sms/sms";
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Flex,
  Form,
  Menu,
  Modal,
  Select,
  Skeleton,
  message,
} from "antd";
import { store } from "../../../redux/configStores";
import { getAllListCustomer, getListCustomer } from "../../../services/customer/customer";
import { useSelector } from "react-redux";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { useState, useEffect } from "react";
import { Mention, MentionsInput } from "react-mentions";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";

const { Option } = Select;
export default function AddScheduleSms({ currentPage, pageSize }) {
  const { allListCustomer, loading } = useSelector((state) => state.customer);
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer);

  const options = allListCustomer?.data.map((item) => {
    return {
      label: item?.full_name,
      value: item?.id,
      phone: item?.phone,
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllListCustomer());
    };
    fetchData();
  }, [dispatch]);

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
    if (selectedValues.length === 0) {
      message.error("Vui lòng chọn khách hàng ");
      return;
    }
    const timeValue = values["send_time"];
    const updatedValues = {
      content: parameterValue,
      send_time: timeValue.format("YYYY-MM-DD HH:mm"),
      customer_ids: selectedValues,
    };
    console.log("Updated values:", updatedValues);
    setIsLoadSentSms(true);
    try {
      const response = await store.dispatch(createScheduleSms(updatedValues));
      if (createScheduleSms.fulfilled.match(response)) {
        setIsLoadSentSms(false);
        setParameterValue("");
        form.resetFields();
        handleCancel();
        message.success("Thao tác thành công");
        await store.dispatch(getListScheduleSms({ currentPage, pageSize }));
      } else if (createScheduleSms.rejected.match(response)) {
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
    // { display: "Số lần bảo dưỡng", id: "SolanBD" },
    { display: "Ngày sinh", id: "NgaySinh" },
    { display: "Thương hiệu", id: "ThuongHieu" },
    // { display: "Tên xe", id: "TenXe" },
    // { display: "Biển số", id: "BienSo" },
    // { display: "Số khung", id: "SoKhung" },
    // { display: "Số máy", id: "SoMay" },
    { display: "Số điện thoại", id: "SoDienThoai" },
    // { display: "Ngày bảo dưỡng", id: "NgayBaoDuong" },
    // { display: "Ngày mua xe", id: "NgayMuaXe" },
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
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAll = (e) => {
    const allValues = options.map((item) => item.value);
    if (e.target.checked === true) {
      setSelectedValues(allValues);
      setSelectAllChecked(true);
    } else {
      setSelectedValues([]);
      setSelectAllChecked(false);
    }
  };

  const onChangeSelect = (value) => {
    setSelectedValues(value);
    setSelectAllChecked(false); // Reset select all button
  };
  const handleSearch = debounce((value) => {
    console.log(value);
    if (!value) return;
    try {
      store.dispatch(
        getListCustomer({ currentPage: 1, pageSize: pageSizeScroll, value })
      );
    } catch (error) {
      console.error("Error occurred while searching:", error);
    }
  }, 500);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Đặt lịch gửi tin
      </Button>
      <Modal
        title=" Đặt lịch gửi tin"
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
          <Form.Item name="customer_ids" label="Chọn khách hàng" required>
            <div style={{ marginTop: "10px" }}>
              <Checkbox
                disabled={options?.length === 0}
                onChange={handleSelectAll}
                checked={selectAllChecked}
              >
                Tất cả
              </Checkbox>
            </div>
            <Select
              allowClear
              showSearch
              mode="multiple"
              maxTagCount="responsive"
              virtual
              optionFilterProp="label"
              // optionLabelProp="label"
              // filterOption={false}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              onSearch={handleSearch}
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
              placeholder="Tìm kiếm theo tên hoặc số điện thoại"
              onPopupScroll={handlePopupScroll}
              onChange={onChangeSelect}
              value={selectedValues}
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
            name="send_time"
            label="Thời gian"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời gian",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              disabledDate={(current) =>
                current && current && current < dayjs().startOf("day")
              }
              placeholder="YYYY-MM-DD HH:mm"
              format="YYYY-MM-DD HH:mm"
            />
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
              Đặt lịch gửi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
