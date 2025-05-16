// import {
//   Breadcrumb,
//   Button,
//   Col,
//   DatePicker,
//   Form,
//   Input,
//   InputNumber,
//   Modal,
//   Radio,
//   Result,
//   Row,
//   Select,
//   Skeleton,
//   Space,
//   message,
// } from "antd";

// import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
// import { store } from "../../../redux/configStores";
// import { useSelector } from "react-redux";
// import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
// import {
//   getDetailCustomer,
//   getListCustomer,
// } from "../../../services/customer/customer";
// import { useEffect, useRef, useState } from "react";
// import { createCarManage } from "../../../services/carmanage/carmanage";
// import { reGexLicensePlates, reGexPhone } from "../../../utils/config";
// import { useNavigate, useParams } from "react-router-dom";
// import ModalAddCustomer from "../CarManage/ModalAddCustomer";
// import CustomerOption from "../../../components/CustomOption/CustomerOption";

// export default function AddCar() {
//   const navigate = useNavigate();
//   const showRef = useRef(null);
//   const [formRef] = Form.useForm();
//   const handleShowAddCustomer = () => {
//     showRef.current.showModal();
//   };

//   const { listCustomer, loading } = useSelector((state) => state.customer);
//   const { loadingScroll, handlePopupScroll, pageSizeScroll } =
//     usePaginationSelect(getListCustomer, true);
//   const options = listCustomer?.data?.map((item) => {
//     return {
//       value: item?.id,
//       name: item.full_name,
//       label: <CustomerOption {...item} />,
//     };
//   });
//   const [formAdd] = Form.useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const onFinish = async (fieldsValue) => {
//     setIsLoading(true);
//     try {
//       const values = {
//         ...fieldsValue,
//         day_sale: fieldsValue["day_sale"]?.format("YYYY-MM-DD HH:mm:ss"),
//       };
//       const response = await store.dispatch(createCarManage(values));
//       if (createCarManage.fulfilled.match(response)) {
//         setIsLoading(false);
//         formAdd.resetFields();
//         Modal.confirm({
//           title: "Bạn có muốn chuyển sang trang danh sách xe không ?",
//           content: (
//             <Result
//               className="config-modal"
//               status="success"
//               title="Thêm mới thành công"
//             />
//           ),
//           footer: (_, { OkBtn, CancelBtn }) => (
//             <>
//               <CancelBtn />
//               <OkBtn />
//             </>
//           ),
//           onOk() {
//             navigate("/car-manage");
//           },
//         });
//       } else if (createCarManage.rejected.match(response)) {
//         setIsLoading(false);
//         if (response.payload.errors) {
//           Object.keys(response.payload.errors).forEach((field) => {
//             const errorMessages = response.payload.errors[field];
//             errorMessages.forEach((errorMessage) => {
//               message.error(errorMessage);
//             });
//           });
//         }
//       }
//     } catch (error) {
//       setIsLoading(false);
//       message.error("Có lỗi xảy ra");
//     }
//   };

//   const { id } = useParams();
//   const [loadingDetail, setLoadingDetail] = useState();
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoadingDetail(true); // Bắt đầu loading
//       try {
//         const res = await store.dispatch(getDetailCustomer(id));
//         formAdd.setFieldsValue({
//           customer_id: res.payload.data.id,
//         });
//       } catch (error) {
//         console.error("Failed to fetch customer details:", error);
//       } finally {
//         setLoadingDetail(false); // Kết thúc loading
//       }
//     };
//     if (id) {
//       fetchData();
//     }
//   }, [id, formAdd]);
//   const [phone, setPhone] = useState();
//   useEffect(() => {
//     if (phone) {
//       formRef.setFieldsValue({
//         phone: phone,
//       });
//     }
//   }, [phone, formRef]);

//   const handleSearch = async (value) => {
//     console.log(value);
//     if (!value) return;
//     try {
//       const res = await store.dispatch(
//         getListCustomer({
//           currentPage: 1,
//           pageSize: pageSizeScroll,
//           search: value,
//         })
//       );
//       if (res.payload.data.length === 0) {
//         setPhone(value);
//         handleShowAddCustomer();
//         await store.dispatch(
//           getListCustomer({
//             currentPage: 1,
//             pageSize: pageSizeScroll,
//             value: null,
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Error occurred while searching:", error);
//     }
//   };
//   const [showDate, setShowDate] = useState(true);
//   const handleShowDate = (e) => {
//     if (e.target.value === "XeBaoDuong") {
//       setShowDate(false);
//     } else {
//       setShowDate(true);
//     }
//   };
//   return (
//     <>
//       <h2>Thêm xe khách hàng</h2>
//       <Breadcrumb
//         separator=">"
//         items={[
//           {
//             title: "Home",
//             href: "/",
//           },
//           {
//             title: "Khách hàng",
//           },
//           {
//             title: "Thêm xe khách hàng",
//             href: "/addcar",
//           },
//         ]}
//       />
//       <div className="addCarCustomer">
//         <Form
//           name="addCar"
//           onFinish={onFinish}
//           layout="vertical"
//           requiredMark=""
//           form={formAdd}
//         >
//           {loadingDetail && id ? (
//             <Skeleton active paragraph />
//           ) : (
//             <>
//               <Row gutter={[8, 8]}>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     name="customer_id"
//                     label="Chọn khách hàng"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Vui lòng chọn khách hàng",
//                       },
//                     ]}
//                   >
//                     <Select
//                       allowClear
//                       showSearch
//                       virtual
//                       options={options}
//                       disabled={id || loadingDetail}
//                       onSearch={(value) => {
//                         if (value === "" || value.match(reGexPhone)) {
//                           handleSearch(value);
//                         }
//                       }}
//                       filterOption={(input, option) =>
//                         option?.children
//                           ?.toLowerCase()
//                           .includes(input.toLowerCase())
//                       }
//                       onClear={() => {
//                         store.dispatch(
//                           getListCustomer({
//                             currentPage: 1,
//                             pageSize: pageSizeScroll,
//                             value: null,
//                           })
//                         );
//                       }}
//                       optionFilterProp="label"
//                       optionLabelProp="name"
//                       // filterOption={false}
//                       loading={loading}
//                       placeholder="Tìm kiếm theo số điện thoại"
//                       onPopupScroll={handlePopupScroll}
//                     >
//                       {options?.map((item) => (
//                         <Option key={item.value} value={item.value}>
//                           {item.label}
//                         </Option>
//                       ))}
//                       {loadingScroll && (
//                         <Option key="loading" disabled>
//                           <Skeleton active paragraph={{ rows: 1 }} />
//                         </Option>
//                       )}
//                     </Select>
//                   </Form.Item>
//                 </Col>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     rules={[
//                       {
//                         required: false,
//                         message: "Vui lòng nhập số bảo hành",
//                       },
//                     ]}
//                     name="warranty_number"
//                     label="Số bảo hành"
//                   >
//                     <Input placeholder="Số bảo hành" />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={[8, 8]}>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     rules={[
//                       {
//                         required: true,
//                         message: "Vui lòng chọn loại bảo dưỡng ",
//                       },
//                     ]}
//                     name="type"
//                     label="Loại"
//                   >
//                     <Radio.Group onChange={handleShowDate}>
//                       <Space direction="horizontal">
//                         <Radio value={"XeBan"}>Xe bán</Radio>
//                         <Radio value={"XeBaoDuong"}>Xe bảo dưỡng</Radio>
//                       </Space>
//                     </Radio.Group>
//                   </Form.Item>
//                 </Col>
//                 <Col xl={12} lg={12} md={12} sm>
//                   {showDate && (
//                     <Form.Item
//                       name="day_sale"
//                       label="Ngày mua"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Vui lòng chọn ngày mua",
//                         },
//                       ]}
//                     >
//                       <DatePicker
//                         style={{ width: "100%" }}
//                         showTime
//                         // disabledDate={(current) =>
//                         //   current && current && current < dayjs().startOf("day")
//                         // }
//                         placeholder="YYYY-MM-DD HH:mm:ss"
//                         format="YYYY-MM-DD HH:mm:ss"
//                       />
//                     </Form.Item>
//                   )}
//                 </Col>
//               </Row>
//               {showDate && (
//                 <Form.Item
//                   name="motor_price"
//                   label="Giá xe"
//                   rules={[
//                     {
//                       required: false,
//                       message: "Vui lòng nhập số tiền",
//                     },
//                   ]}
//                 >
//                   <InputNumber
//                     formatter={(value) =>
//                       `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                     }
//                     parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//                     placeholder="Số tiền"
//                   />
//                 </Form.Item>
//               )}
//               <Row gutter={[8, 8]}>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     name="name_bike"
//                     label="Tên xe"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Vui lòng nhập tên xe",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Tên xe" />
//                   </Form.Item>
//                 </Col>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     name="license_plate"
//                     label="Biển số"
//                     rules={[
//                       {
//                         required: false,
//                         message: "Vui lòng nhập biển số xe",
//                       },
//                       {
//                         pattern: reGexLicensePlates,
//                         message: "Sai định dạng biển số xe",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Ví dụ : 29C1-99999" />
//                   </Form.Item>
//                 </Col>
//               </Row>
//               <Row gutter={[8, 8]}>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     name="frame_number"
//                     label="Số khung"
//                     rules={[
//                       {
//                         required: false,
//                         message: "Vui lòng nhập số khung",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Số khung" />
//                   </Form.Item>
//                 </Col>
//                 <Col xl={12} lg={12} md={12} sm>
//                   <Form.Item
//                     name="machine_number"
//                     label="Số máy"
//                     rules={[
//                       {
//                         required: false,
//                         message: "Vui lòng nhập số máy",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="Số máy" />
//                   </Form.Item>
//                 </Col>
//               </Row>

//               <Row>
//                 <Form.Item>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={isLoading}
//                     icon={<PlusCircleOutlined />}
//                   >
//                     Thêm mới
//                   </Button>
//                 </Form.Item>
//                 <Button
//                   type="primary"
//                   danger
//                   onClick={() => navigate("/customer")}
//                   icon={<CloseCircleOutlined />}
//                   style={{ marginLeft: 8 }}
//                 >
//                   Hủy
//                 </Button>
//               </Row>
//             </>
//           )}
//         </Form>
//         <ModalAddCustomer formAdd={formAdd} ref={showRef} formRef={formRef} />
//       </div>
//     </>
//   );
// }



import React, { useState, useRef, useEffect } from 'react';
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
  message,
} from "antd";
import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { store } from "../../../redux/configStores";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createCarManage } from "../../../services/carmanage/carmanage";
import { reGexLicensePlates } from "../../../utils/config";
import ModalAddCustomer from "../CarManage/ModalAddCustomer";
import { getListCustomer } from '../../../services/customer/customer';
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import CustomerOption from "../../../components/CustomOption/CustomerOption";
import { getListMotorStore } from '../../../services/motorStore/motorStore';

const { Option } = Select;

export default function AddCar() {
  const navigate = useNavigate();
  const [formAdd] = Form.useForm();
  const showRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Danh sách xe (giả định)
  const { listMotorStore, isLoadMotorStore } = useSelector((state) => state.motorStore);
  const { loadingMotorScroll, handlePopupMotorScroll, pageSizeMotorScroll } =
    usePaginationSelect(getListMotorStore, true);
  const motorOptions = listMotorStore?.data?.map((item) => {
    return {
      value: item?.id,
      name: item.name_bike,
      label: item.name_bike,
    };
  });

  console.log('listMotorStore', listMotorStore);

  const { listCustomer, loading } = useSelector((state) => state.customer);
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCustomer, true);
  const options = listCustomer?.data?.map((item) => {
    return {
      value: item?.id,
      name: item.full_name,
      label: <CustomerOption {...item} />,
    };
  });

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);

    // Reset form khi thay đổi loại
    formAdd.resetFields([
      'vehicle_id',
      'name_bike',
      'license_plate',
      'frame_number',
      'machine_number',
      'motor_price'
    ]);
  };
  const { id } = useParams();
  const [loadingDetail, setLoadingDetail] = useState();

  const handleVehicleSelect = (vehicleId) => {
    const selectedVehicle = listMotorStore.data.find(v => v.id === vehicleId);
    console.log('selectedVehicle', selectedVehicle);
    if (selectedVehicle) {
      formAdd.setFieldsValue({
        vehicle_id: selectedVehicle.id,
        name_bike: selectedVehicle.name_bike,
        license_plate: selectedVehicle.license_plate,
        frame_number: selectedVehicle.frame_number,
        machine_number: selectedVehicle.machine_number,
        warranty_number: selectedVehicle.warranty_number,
        motor_price: parseFloat(selectedVehicle.motor_price)
      });
    } else {
      console.warn('Không tìm thấy xe với ID:', vehicleId);
    }
  };

  const onFinish = async (fieldsValue) => {
    setIsLoading(true);
    try {
      const values = {
        ...fieldsValue,
        day_sale: fieldsValue.day_sale?.format("YYYY-MM-DD HH:mm:ss"),
      };

      const response = await store.dispatch(createCarManage(values));

      if (createCarManage.fulfilled.match(response)) {
        formAdd.resetFields();
        Modal.confirm({
          title: "Bạn có muốn chuyển sang trang danh sách xe không?",
          content: <Result status="success" title="Thêm mới thành công" />,
          onOk() {
            navigate("/car-manage");
          },
        });
      } else {
        throw new Error("Thêm xe thất bại");
      }
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Thêm xe khách hàng</h2>
      <Breadcrumb
        separator=">"
        items={[
          { title: "Home", href: "/" },
          { title: "Khách hàng" },
          { title: "Thêm xe khách hàng", href: "/addcar" },
        ]}
      />

      <Form
        form={formAdd}
        onFinish={onFinish}
        layout="vertical"
        requiredMark=""
      >
        {/* Chọn loại xe */}
        <Form.Item
          name="type"
          label="Loại xe"
          rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
        >
          <Radio.Group onChange={handleTypeChange}>
            <Space>
              <Radio value="XeBan">Xe bán</Radio>
              <Radio value="XeBaoDuong">Xe bảo dưỡng</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col xl={12} lg={12}>
            {/* Chọn khách hàng */}
            <Form.Item
              name="customer_id"
              label="Chọn khách hàng"
              rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
            >
              <Select
                allowClear
                showSearch
                virtual
                options={options}
                disabled={id || loadingDetail}
                onSearch={(value) => {
                  if (value === "" || value.match(reGexPhone)) {
                    handleSearch(value);
                  }
                }}
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
                optionFilterProp="label"
                optionLabelProp="name"
                // filterOption={false}
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

          {/* Nếu là xe bán */}
          {selectedType === 'XeBan' && (
            <Col xl={12} lg={12}>
              <Form.Item
                name="vehicle_id"
                label="Chọn xe"
                rules={[{ required: true, message: "Vui lòng chọn xe" }]}
              >
                {/* <Select
                  placeholder="Chọn xe"
                  onChange={handleVehicleSelect}
                >
                  {vehicleList.map(vehicle => (
                    <Option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </Option>
                  ))}
                </Select> */}

                <Select
                  onChange={handleVehicleSelect}
                  allowClear
                  showSearch
                  virtual
                  options={motorOptions}
                  // disabled={id || loadingDetail}
                  onSearch={(value) => {
                    if (value === "") {
                      handleSearch(value);
                    }
                  }}
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onClear={() => {
                    store.dispatch(
                      getListMotorStore({
                        currentPage: 1,
                        pageSize: pageSizeMotorScroll,
                        value: null,
                      })
                    );
                  }}
                  optionFilterProp="label"
                  optionLabelProp="name"
                  // filterOption={false}
                  loading={isLoadMotorStore}
                  placeholder="Tìm kiếm theo tên xe"
                  onPopupScroll={handlePopupMotorScroll}
                >
                  {options?.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                  {loadingMotorScroll && (
                    <Option key="loading" disabled>
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        {/* Các trường thông tin xe (áp dụng cho cả 2 loại) */}
        <Row gutter={[16, 16]}>
          <Col xl={12} lg={12}>
            <Form.Item
              name="name_bike"
              label="Tên xe"
              rules={[{ required: selectedType !== 'XeBan', message: "Vui lòng nhập tên xe" }]}
            >
              <Input
                placeholder="Tên xe"
                disabled={selectedType === 'XeBan'}
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12}>
            <Form.Item
              name="license_plate"
              label="Biển số"
              rules={[
                {
                  pattern: reGexLicensePlates,
                  message: "Sai định dạng biển số xe"
                },
                { required: selectedType !== 'XeBan', message: "Vui lòng nhập biển số xe" }
              ]}
            >
              <Input
                placeholder="Ví dụ: 29C1-99999"
                disabled={selectedType === 'XeBan'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xl={12} lg={12}>
            <Form.Item name="frame_number" label="Số khung"
              rules={[
                { required: selectedType !== 'XeBan', message: "Vui lòng nhập số khung" }
              ]}>
              <Input
                placeholder="Số khung"
                disabled={selectedType === 'XeBan'}
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12}>
            <Form.Item name="machine_number" label="Số máy"
              rules={[
                { required: selectedType !== 'XeBan', message: "Vui lòng nhập số máy" }
              ]}>
              <Input
                placeholder="Số máy"
                disabled={selectedType === 'XeBan'}
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12}>
            <Form.Item name="warranty_number" label="Số bảo hành">
              <Input
                placeholder="Số bảo hành"
                disabled={selectedType === 'XeBan'}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Giá xe và ngày mua (chỉ hiện với xe bán) */}
        {selectedType === 'XeBan' && (

          <Row gutter={[16, 16]}>
            <Col xl={12} lg={12}>
              <Form.Item
                name="motor_price"
                label="Giá xe"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Giá xe"
                  disabled={selectedType === 'XeBan'}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12}>
              <Form.Item
                name="day_sale"
                label="Ngày mua"
                rules={[{ required: true, message: "Vui lòng chọn ngày mua" }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="Chọn ngày mua"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Nút submit */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
              loading={isLoading}
            >
              Thêm mới
            </Button>
            <Button
              danger
              onClick={() => navigate("/customer")}
              icon={<CloseCircleOutlined />}
            >
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Modal thêm khách hàng */}
      <ModalAddCustomer ref={showRef} />
    </>
  );
}
