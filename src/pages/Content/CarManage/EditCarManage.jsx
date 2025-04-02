import { forwardRef, useEffect, useState } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { getListCustomer } from "../../../services/customer/customer";
import { store } from "../../../redux/configStores";
import dayjs from "dayjs";
import {
  editCarManage,
  getListCarManage,
} from "../../../services/carmanage/carmanage";
import { reGexLicensePlates } from "../../../utils/config";
const { Option } = Select;
const EditCarManage = forwardRef(function EditCarManage(props, ref) {
  const { currentPage, pageSize, record } = props;
  const { listCustomer, loading } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formatValues = (fieldsValue) => {
    return {
      ...fieldsValue,
      day_sale: fieldsValue["day_sale"]?.format("YYYY-MM-DD HH:mm:ss"),
    };
  };
  const {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  } = useEditHandler(
    editCarManage,
    getListCarManage,
    dispatch,
    ref,
    currentPage,
    pageSize,
    formatValues
  );
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer, isModalOpenEdit);
  const options = listCustomer?.data.map((item) => {
    return {
      label: item?.full_name,
      value: item?.id,
    };
  });

  useEffect(() => {
    form.setFieldsValue({
      customer_id: updateRecord?.customer_id,
      store_id: updateRecord?.store_id,
      type: updateRecord?.type,
      name_bike: updateRecord?.name_bike,
      license_plate: updateRecord?.license_plate,
      frame_number: updateRecord?.frame_number,
      machine_number: updateRecord?.machine_number,
      maintain_quantity: updateRecord?.maintain_quantity,
      warranty_number: updateRecord?.warranty_number,
      motor_price: updateRecord?.motor_price,
      day_sale: dayjs(updateRecord?.day_sale),
    });
  }, [updateRecord, form, isModalOpenEdit]);
  // const handleSearch = (value) => {
  //   if (!value) return;
  //   try {
  //     store.dispatch(
  //       getListCustomer({
  //         currentPage: 1,
  //         pageSize: pageSizeScroll,
  //         search: value,
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Error occurred while searching:", error);
  //   }
  // };
  useEffect(() => {
    if (updateRecord?.type === "XeBaoDuong") {
      setShowDate(false);
    } else {
      setShowDate(true);
    }
  }, [updateRecord]);
  const [showDate, setShowDate] = useState();
  const handleShowDate = (e) => {
    if (e.target.value === "XeBaoDuong") {
      setShowDate(false);
    } else {
      setShowDate(true);
    }
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
        title="Sửa thông tin xe"
        open={isModalOpenEdit}
        footer={null}
        width={850}
        onCancel={handleCancelEdit}
      >
        <Form
          name="addCar"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="customer_id"
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
                  virtual
                  optionFilterProp="children"
                  // filterOption={false}
                  // onSearch={(value) => {
                  //   if (value.match(/^0[0-9]{9}$/)) {
                  //     handleSearch(value);
                  //   }
                  // }}
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
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
                  placeholder="Tìm kiếm theo số điện thoại"
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
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số bảo hành",
                  },
                ]}
                name="warranty_number"
                label="Số bảo hành"
              >
                <Input placeholder="Số bảo hành" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại bảo dưỡng ",
                  },
                ]}
                name="type"
                label="Loại"
              >
                <Radio.Group onChange={handleShowDate}>
                  <Space direction="horizontal">
                    <Radio value={"XeBan"}>Xe bán</Radio>
                    <Radio value={"XeBaoDuong"}>Xe bảo dưỡng</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {showDate && (
                <Form.Item
                  name="day_sale"
                  label="Ngày mua"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày mua",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    showTime
                    // disabledDate={(current) =>
                    //   current && current && current < dayjs().startOf("day")
                    // }
                    placeholder="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          {showDate && (
            <Form.Item
              name="motor_price"
              label="Giá xe"
              rules={[
                {
                  required: false,
                  message: "Vui lòng nhập số tiền",
                },
              ]}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Số tiền"
              />
            </Form.Item>
          )}
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="name_bike"
                label="Tên xe"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên xe",
                  },
                ]}
              >
                <Input placeholder="Tên xe" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="license_plate"
                label="Biển số"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập biển số xe",
                  },
                  {
                    pattern: reGexLicensePlates,
                    message: "Sai định dạng biển số xe",
                  },
                ]}
              >
                <Input placeholder="Ví dụ : 29C1-99999" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            {/* <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="frame_number"
                label="Số khung"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số khung",
                  },
                ]}
              >
                <Input placeholder="Số khung" />
              </Form.Item>
            </Col> */}
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="machine_number"
                label="Số máy móc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số máy móc",
                  },
                ]}
              >
                <Input placeholder="Số máy móc" />
              </Form.Item>
            </Col>
          </Row>
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

EditCarManage.displayName = "EditCarManage";

export default EditCarManage;
