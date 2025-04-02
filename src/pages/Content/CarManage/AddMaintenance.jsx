import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Result,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "../../../redux/configStores";
import {
  getDetailCarManage,
  getListCarManage,
} from "../../../services/carmanage/carmanage";
import { useSelector } from "react-redux";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { getListCustomer } from "../../../services/customer/customer";
import { createVehicleMaintenance } from "../../../services/vehicleMaintenance/vehicleMaintenance";
import { getDetailAccessarys } from "../../../services/accessarys/accessarys";
import dayjs from "dayjs";
import { reGexPhone } from "../../../utils/config";
import CustomerOption from "../../../components/CustomOption/CustomerOption";
const { Option } = Select;

export default function AddMaintenance() {
  const { id } = useParams();
  const [formAdd] = Form.useForm();
  const [customerSelected, setCustomerSelected] = useState(false);
  const { listCustomer, loading } = useSelector((state) => state.customer);
  const { listCarManage, isLoadCarManage } = useSelector(
    (state) => state.carmanage
  );
  const { allListAccessarys, isLoadAccessarysAll } = useSelector(
    (state) => state.accessarys
  );
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer, true);
  const {
    handlePopupScroll: handlePopupScrollCar,
    pageSizeScroll: pageSizeScrollCar,
  } = usePaginationSelect(getListCarManage);
  const [loadingDetail, setLoadingDetail] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDetail(true); // Bắt đầu loading
      try {
        const res = await store.dispatch(getDetailCarManage(id));
        // console.log(res)
        formAdd.setFieldsValue({
          customer_id: res.payload.data.customer.id,
          motor_id: res.payload.data.id,
        });
        await store.dispatch(
          getListCarManage({
            currentPage: 1,
            pageSize: pageSizeScrollCar,
            customer_id: res.payload.data.customer.id,
          })
        ),
          setLoadingDetail(false); // Kết thúc loading
        setCustomerSelected(true);
      } catch (error) {
        setLoadingDetail(false); // Kết thúc loading
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, formAdd, pageSizeScrollCar]);

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
  const options = listCustomer?.data?.map((item) => {
    return {
      value: item?.id,
      // avatar: item.avatar,
      // phoneNumber: item.phone,
      // email: item.email,
      name: item.full_name,
      label: <CustomerOption {...item} />,
    };
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    const data = {
      ...values,
      day_in: values["day_in"].format("YYYY-MM-DD HH:mm:ss"),
      accessary_ids: selectedAccessories,
    };
    setIsLoading(true);
    try {
      const response = await store.dispatch(createVehicleMaintenance(data));
      console.log('res',response);
      if(response.payload.error){
        setIsLoading(false);
        message.error(response.payload.error);  
      }
      if (createVehicleMaintenance.fulfilled.match(response) && !response.payload.error) {
        setIsLoading(false);
        formAdd.resetFields();
        setSelectedAccessories([]);
        Modal.confirm({
          title: "Bạn có muốn chuyển sang trang danh sách bảo dưỡng không ?",
          content: (
            <Result
              className="config-modal"
              status="success"
              title="Thêm mới thành công"
            />
          ),
          footer: (_, { OkBtn, CancelBtn }) => (
            <>
              <CancelBtn />
              <OkBtn />
            </>
          ),
          onOk() {
            navigate("/vehicle-maintenance");
          },
        });
      } else if (createVehicleMaintenance.rejected.match(response)) {
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
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const handleSearch = async (value) => {
    if (!value) return;
    try {
      if (value === "") {
        store.dispatch(
          getListCustomer({
            currentPage: 1,
            pageSize: pageSizeScroll,
            value: null,
          })
        );
      } else {
        await store.dispatch(
          getListCustomer({
            currentPage: 1,
            pageSize: pageSizeScroll,
            search: value,
          })
        );
      }
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
        formAdd.resetFields(["motor_id"]);
    } catch (error) {
      console.error("Error occurred while filtering cars:", error);
    }
  };
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [loadingSelect, setLoadingSelect] = useState(false);

  const handleSelectChange = async (selectedValues) => {
    try {
      setLoadingSelect(true); // Đặt trạng thái loading là true khi bắt đầu gọi API

      const accessoryDetails = await Promise.all(
        selectedValues.map((accessoryId) =>
          store.dispatch(getDetailAccessarys(accessoryId))
        )
      );

      const newSelectedAccessories = accessoryDetails
        .filter((detail) => detail)
        .map((detail) => ({
          accessary_id: detail.payload.data.id,
          quantity_export:  1,
          inventory_quantity: detail.payload.data.inventory_quantity,
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
      const newSelectedAccessories = [...prevState];
      newSelectedAccessories[index].quantity_export = value;
      return newSelectedAccessories;
    });
  }, []);
  const handlePriceChange = useCallback((index, value) => {
    setSelectedAccessories((prevState) => {
      const newSelectedAccessories = [...prevState];
      newSelectedAccessories[index].unit_price = value;
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
  console.log('reeA', selectedAccessories);
  
  return (
    <>
      <h2>Tạo bảo dưỡng, sửa chữa </h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Bảo dưỡng, sửa chữa",
          },
          {
            title: "Tạo mới",
            href: "/addMaintenance",
          },
        ]}
      />
      <div className="addCarCustomer">
        <Form
          name="addMaintain"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          {loadingDetail && id ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <>
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
                      options={options}
                      filterOption={false}
                      optionFilterProp="label"
                      optionLabelProp="name"
                      onChange={handleFilterCar}
                      onSearch={(value) => {
                        if (value === "" || value.match(reGexPhone)) {
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
                      disabled={id || loadingDetail}
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
                        option?.label
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      disabled={!customerSelected || isLoadCarManage || id}
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
                    message: "Vui lòng chọn loại công việc",
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
                        option?.label
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
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
              </Row>
              {loadingSelect ? (
                <Spin>
                  <div className="content" />
                </Spin>
              ) : (
                selectedAccessories.map((accessory, index) => (
                  <Row
                    gutter={[8, 8]}
                    justify={"space-between"}
                    key={accessory.id}
                  >
                    <Col xl={8} lg={8} md={8} sm={8}>
                      <Form.Item
                        label={
                          <span>
                            Số lượng ({accessory.inventory_quantity}) /
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
                          // value={accessory?.quantity_export}
                          defaultValue={1}
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
                      placeholder="số Km"
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm>
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
              </Row>
              <Row gutter={[8, 8]}>
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
                <Col xl={12} lg={12} md={12} sm>
                  <Form.Item
                    name="deposit"
                    label="Số tiền trả trước"
                    rules={[
                      {
                        required: false,
                        message: "Số tiền trả trước",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || /^[0-9]+$/.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Chỉ được nhập số");
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Số tiền trả trước" />
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
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  icon={<PlusCircleOutlined />}
                  style={{
                    padding: "9px 36px",
                    height: "auto",
                    fontSize: "16px",
                    fontWeight: "500",
                    width: "100%",
                  }}
                >
                  Tạo
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    </>
  );
}
