import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { EditOutlined, FileOutlined, SyncOutlined } from "@ant-design/icons";
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
  Tooltip,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Mention, MentionsInput } from "react-mentions";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { getAllListCustomer, getListCustomer } from "../../../services/customer/customer";
import { store } from "../../../redux/configStores";
import { editScheduleSms, getListScheduleSms } from "../../../services/sms/sms";
import dayjs from "dayjs";
const { Option } = Select;
const EditScheduleSms = forwardRef(function EditScheduleSms(props, ref) {
  const { allListCustomer, loading } = useSelector((state) => state.customer);

  console.log('list customers', allListCustomer);

  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer);
  const options = allListCustomer?.data.map((item) => {
    return {
      label: item?.full_name,
      value: item?.id,
    };
  });
  const dispatch = useDispatch();
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
  const { currentPage, pageSize, record } = props;
  const [form] = Form.useForm();
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [updateRecord, setUpdateRecord] = useState();
  const [isEditLoading, setEditLoading] = useState(false);
  const showModalEdit = useCallback((record) => {
    setIsModalOpenEdit(true);
    setUpdateRecord(record); // Cập nhật record khi showModalEdit được gọi
  }, []);
  const handleCancelEdit = useCallback(() => {
    setIsModalOpenEdit(false);
  }, []);
  useImperativeHandle(ref, () => ({
    showModalEdit,
    handleCancelEdit,
  }));

  console.log('update record', updateRecord);

  useEffect(() => {
    if (updateRecord) {
      form.setFieldsValue({
        send_time: dayjs(updateRecord.send_time),
      });
      setSelectedValues(updateRecord?.customer_ids);
      setParameterValue(updateRecord?.content); // Cập nhật giá trị từ record vào state parameterValue
    }

  }, [updateRecord, form]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await dispatch(getAllListCustomer());
  //   };
  //   fetchData();
  // }, [dispatch]);

  const onFinish = async (values) => {
    if (!parameterValue.trim()) {
      message.error("Vui lòng nhập nội dung tin nhắn ");
      return;
    }
    if (selectedValues?.length === 0) {
      message.error("Vui lòng chọn khách hàng ");
      return;
    }
    const timeValue = values["send_time"];
    const updatedValues = {
      id: updateRecord?.id,
      content: parameterValue,
      send_time: timeValue.format("YYYY-MM-DD HH:mm:ss"),
      customer_ids: selectedValues,
    };
    console.log("Updated values:", updatedValues);
    setEditLoading(true);
    try {
      const response = await store.dispatch(editScheduleSms(updatedValues));
      if (editScheduleSms.fulfilled.match(response)) {
        setEditLoading(false);
        setParameterValue("");
        form.resetFields();
        handleCancelEdit();
        message.success("Thao tác thành công");
        await store.dispatch(getListScheduleSms({ currentPage, pageSize }));
      } else if (editScheduleSms.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
          setEditLoading(false);
        }
      }
    } catch (error) {
      setEditLoading(false);
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
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAll = (e) => {
    const allValues = options.map((item) => item.value);
    console.log(allValues);
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
  return (
    <div>
      <Tooltip placement="top" title="Sửa">
        <span
          style={{
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => {
            showModalEdit(record);
          }}
        >
          <EditOutlined />
        </span>
      </Tooltip>

      <Modal
        title=" Đặt lịch gửi tin"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="sentmessage"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Form.Item name="customer_ids" label="Chọn khách hàng">
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
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                optionA?.label
                  ?.toLowerCase()
                  .localeCompare(optionB?.label?.toLowerCase())
              }
              loading={loading}
              placeholder="Vui lòng chọn khách hàng"
              onPopupScroll={handlePopupScroll}
              onChange={onChangeSelect}
              value={selectedValues}
              onSearch={handleSearch}
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
              placeholder="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
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
              loading={isEditLoading}
              icon={<SyncOutlined />}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

EditScheduleSms.displayName = "EditScheduleSms";

export default EditScheduleSms;
