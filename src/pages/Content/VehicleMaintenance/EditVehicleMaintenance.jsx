import { forwardRef, useCallback, useEffect, useState } from "react";
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
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { getListCustomer } from "../../../services/customer/customer";
import { store } from "../../../redux/configStores";
import dayjs from "dayjs";
import {
  editVehicleMaintenance,
  getListVehicleMaintenance,
} from "../../../services/vehicleMaintenance/vehicleMaintenance";
import { getListCarManage } from "../../../services/carmanage/carmanage";
import { getDetailAccessarys } from "../../../services/accessarys/accessarys";
const { Option } = Select;
const EditVehicleMaintenance = forwardRef(function EditVehicleMaintenance(
  props,
  ref
) {
  const { currentPage, pageSize, record, filters } = props;
  const { listCustomer, loading } = useSelector((state) => state.customer);
  const { allListAccessarys, isLoadAccessarysAll } = useSelector(
    (state) => state.accessarys
  );
  const { listCarManage, isLoadCarManage } = useSelector(
    (state) => state.carmanage
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formatValues = (fieldsValue) => {
    return {
      ...fieldsValue,
      accessary_ids: selectedAccessories,
      day_in: fieldsValue["day_in"]?.format("YYYY-MM-DD HH:mm:ss"),
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
    editVehicleMaintenance,
    getListVehicleMaintenance,
    dispatch,
    ref,
    currentPage,
    pageSize,
    formatValues,
    filters
  );
  const [customerSelected, setCustomerSelected] = useState(false);
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer, isModalOpenEdit);
  const {
    // loadingScroll: loadingScrollCar,
    handlePopupScroll: handlePopupScrollCar,
    pageSizeScroll: pageSizeScrollCar,
  } = usePaginationSelect(getListCarManage, isModalOpenEdit);
  const optionCar = listCarManage?.data?.map((item) => {
    return {
      label: item?.name_bike + " / " + item?.license_plate,
      value: item?.id,
    };
  });
  const optionAccessary = allListAccessarys?.data?.map((item) => {
    return {
      label: item?.name_accessary,
      value: item?.id,
    };
  });
  const options = listCustomer?.data.map((item) => {
    return {
      label: item?.full_name,
      value: item?.id,
    };
  });
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [loadingSelect, setLoadingSelect] = useState(false);

  // console.log(selectedAccessories)
  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        customer_id: updateRecord?.customer_id,
        accessary_ids: updateRecord?.accessary?.map((item) => item.id),
        type: updateRecord?.type,
        day_in: dayjs(updateRecord?.day_in),
        day_out: dayjs(updateRecord?.day_out),
        maintenance_time: updateRecord?.maintenance_time,
        km_number: updateRecord?.km_number,
        motor_id: updateRecord?.motor_id,
        status: updateRecord?.status,
        motor_status: updateRecord?.motor_status,
        type_job: updateRecord?.type_job,
        maintenance_accessary: updateRecord?.maintenance_accessary,
        discount: updateRecord?.discount,
        vat: updateRecord?.vat,
        percentage_discount: updateRecord?.percentage_discount,
        deposit: updateRecord?.deposit,
      });
      setSelectedAccessories(
        updateRecord?.maintenance_accessary?.map((item) => {
          return {
            accessary_id: item.accessary_id,
            quantity_export: item.quantity_export,
            unit_price: item.unit_price,
            name: item.accessary_info?.name_accessary,
          };
        })
      );
    }
  }, [updateRecord, form, isModalOpenEdit]);
  useEffect(() => {
    if (updateRecord?.type_job === "BaoDuong") {
      setShowType(true);
    } else {
      setShowType(false);
    }
  }, [updateRecord]);
  const handleSearch = async (value) => {
    if (!value) return;
    try {
      await store.dispatch(
        getListCustomer({ currentPage: 1, pageSize: pageSizeScroll, value })
      ),
        form.resetFields();
    } catch (error) {
      console.error("Error occurred while searching:", error);
    }
  };

  const handleFilterCar = async (value) => {
    setCustomerSelected(!!value);
    try {
      await store.dispatch(
        getListCarManage({
          currentPage: 1,
          pageSize: pageSizeScrollCar,
          customer_id: value,
        })
      ),
        form.resetFields(["motor_id"]);
    } catch (error) {
      console.error("Error occurred while filtering cars:", error);
    }
  };

  const handleSelectChange = async (selectedValues) => {
    try {
      setLoadingSelect(true); // Đặt trạng thái loading là true khi bắt đầu gọi API

      const accessoryDetails = await Promise.all(
        selectedValues?.map((accessoryId) =>
          store.dispatch(getDetailAccessarys(accessoryId))
        )
      );

      const newSelectedAccessories = accessoryDetails
        .filter((detail) => detail)
        .map((detail) => ({
          key: detail.payload.data.id,
          accessary_id: detail.payload.data.id,
          quantity_export: detail.payload.data.inventory_quantity,
          unit_price: detail.payload.data.price,
          name: detail.payload.data.name_accessary,
        }));
      setSelectedAccessories(newSelectedAccessories);
    } catch (error) {
      console.error("Error occurred while fetching accessory details:", error);
    } finally {
      setLoadingSelect(false); // Đặt trạng thái loading là false sau khi kết thúc gọi API
    }
  };
  const handleQuantityChange = useCallback((index, value) => {
    setSelectedAccessories((prevState) => {
      const newSelectedAccessories = prevState.map((accessory, i) => {
        if (i === index) {
          // Nếu là phần tử cần thay đổi, tạo một bản sao của phần tử này và thay đổi thuộc tính quantity_export trên bản sao
          return {
            ...accessory,
            quantity_export: value,
          };
        }
        // Trả về phần tử không cần thay đổi
        return accessory;
      });
      return newSelectedAccessories;
    });
  }, []);

  const handlePriceChange = useCallback((index, value) => {
    setSelectedAccessories((prevState) => {
      const newSelectedAccessories = prevState.map((accessory, i) => {
        if (i === index) {
          // Nếu là phần tử cần thay đổi, tạo một bản sao của phần tử này và thay đổi thuộc tính unit_price trên bản sao
          return {
            ...accessory,
            unit_price: value,
          };
        }
        // Trả về phần tử không cần thay đổi
        return accessory;
      });
      return newSelectedAccessories;
    });
  }, []);
  const [showType, setShowType] = useState(false);
  const handleCheckJob = (e) => {
    if (e.target.value === "BaoDuong") {
      setShowType(true);
    } else {
      setShowType(false);
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
        title="Sửa thông tin bảo dưỡng"
        open={isModalOpenEdit}
        footer={null}
        width={850}
        onCancel={handleCancelEdit}
      >
        <Form
          name="addJob"
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
                  filterOption={false}
                  onChange={handleFilterCar}
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
              {" "}
              <Form.Item
                name="motor_id"
                label="Chọn xe"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn xe",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  options={optionCar}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={!customerSelected || isLoadCarManage}
                  loading={isLoadCarManage}
                  placeholder="Tìm kiếm theo tên"
                  onPopupScroll={handlePopupScrollCar}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại công việc ",
              },
            ]}
            name="type_job"
            label="Loại công việc"
          >
            <Radio.Group onChange={handleCheckJob}>
              <Space direction="horizontal">
                <Radio value={"BaoDuong"}>Bảo dưỡng</Radio>
                <Radio value={"SuaChua"}>Sửa chữa</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Row gutter={[8, 8]}>
            {showType && (
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
                  <Radio.Group>
                    <Space direction="horizontal">
                      <Radio value={"BaoDuongDinhKy"}>Định kỳ</Radio>
                      <Radio value={"BaoDuongDichVu"}>Dịch vụ</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
            )}
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="accessary_ids"
                label="Chọn phụ tùng-vật tư"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn phụ tùng",
                  },
                ]}
              >
                <Select
                  options={optionAccessary}
                  loading={isLoadAccessarysAll}
                  allowClear
                  showSearch
                  virtual
                  maxTagCount="responsive"
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  placeholder="Vui lòng chọn phụ tùng"
                  onChange={handleSelectChange}
                  disabled={loadingSelect}
                />
              </Form.Item>
            </Col>
          </Row>
          {loadingSelect ? (
            <Spin>
              <div className="content" />
            </Spin>
          ) : (
            selectedAccessories.map((accessory, index) => (
              <Row gutter={[8, 8]} justify={"space-between"} key={accessory.id}>
                <Col xl={8} lg={8} md={8} sm={8}>
                  <Form.Item
                    label={
                      <span>
                        Số lượng /
                        <span
                          style={{
                            color: "#52c41a",
                            fontWeight: 600,
                          }}
                        >
                          {accessory.name}
                        </span>
                      </span>
                    }
                  >
                    <InputNumber
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      value={accessory.quantity_export}
                      onChange={(value) => {
                        if (value > 0) handleQuantityChange(index, value);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} md={8} sm={8}>
                  <Form.Item
                    label={
                      <span>
                        Đơn giá /
                        <span
                          style={{
                            color: "#52c41a",
                            fontWeight: 600,
                          }}
                        >
                          {accessory.name}
                        </span>
                      </span>
                    }
                  >
                    <InputNumber
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      value={accessory.unit_price}
                      onChange={(value) => {
                        if (value > 0) handlePriceChange(index, value);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} md={8} sm={8}>
                  <Form.Item
                    label={
                      <span>
                        Thành tiền /
                        <span
                          style={{
                            color: "#52c41a",
                            fontWeight: 600,
                          }}
                        >
                          {accessory.name}
                        </span>
                      </span>
                    }
                  >
                    <Typography.Text type="danger">
                      {(
                        accessory.quantity_export * accessory.unit_price
                      ).toLocaleString("vi-vn")}{" "}
                      VNĐ
                    </Typography.Text>
                  </Form.Item>
                </Col>
              </Row>
            ))
          )}
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="day_in"
                label="Ngày vào"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày vào",
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
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="maintenance_time"
                label="Lần bảo dưỡng"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số lần bảo dưỡng",
                  },
                ]}
              >
                <InputNumber placeholder="Lần bảo dưỡng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="km_number"
                label="Số Km"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số Km",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Số Km"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="motor_status"
                label="Tình trạng xe"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập tình trạng xe",
                  },
                ]}
              >
                <Input placeholder="Tình trạng xe" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="percentage_discount"
                label="Chiết khấu"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập chiết khấu",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Phần trăm %"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="discount"
                label="Giảm giá"
                rules={[
                  {
                    required: false,
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
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={6}>
              <Form.Item
                name="vat"
                label="VAT"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn VAT",
                  },
                ]}
              >
                <Select placeholder="Vui lòng chọn VAT">
                  <Option value={1}>1%</Option>
                  <Option value={2}>2%</Option>
                  <Option value={3}>3%</Option>
                  <Option value={4}>4%</Option>
                  <Option value={5}>5%</Option>
                  <Option value={6}>6%</Option>
                  <Option value={7}>7%</Option>
                  <Option value={8}>8%</Option>
                  <Option value={9}>9%</Option>
                  <Option value={10}>10%</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="deposit"
                label="Trả trước"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số tiền trả trước",
                  },
                ]}
              >
                <InputNumber placeholder="Số tiền trả trước" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="DangBaoDuong">Đang xử lý</Option>
                  <Option value="DaBaoDuong">Đã thanh toán</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isEditLoading}
              icon={<SyncOutlined />}
              disabled={updateRecord?.status === "DaBaoDuong"}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

EditVehicleMaintenance.displayName = "EditVehicleMaintenance";

export default EditVehicleMaintenance;
