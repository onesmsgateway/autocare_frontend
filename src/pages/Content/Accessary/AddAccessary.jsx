import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  InputNumber,
  Radio,
  Space,
} from "antd";
import useAddHandler from "../../../components/CustomHooks/useAddHandler";
import { useSelector } from "react-redux";
import usePaginationSelect from "../../../components/CustomHooks/usePaginationSelect";
import { store } from "../../../redux/configStores";
import { getListWareHouse } from "../../../services/warehouse/warehouse";
import {
  createAccessarys,
  getListAccessarys,
} from "../../../services/accessarys/accessarys";
import { reGexIsNumber } from "../../../utils/config";
import { useEffect } from "react";
const { Option } = Select;
export default function AddAccessary({
  currentPage,
  pageSize,
  optionsSupplier,
  isLoadAllSupplier,
}) {
  const { listWarehouse, isLoadWarehouse } = useSelector(
    (state) => state.warehouse
  );

  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(createAccessarys, getListAccessarys, currentPage, pageSize);
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListWareHouse);
  const options = listWarehouse?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm phụ tùng"
        open={isModalOpen}
        footer={null}
        width={850}
        onCancel={handleCancel}
      >
        <Form
          name="addAccessary"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã phụ tùng ",
                  },
                ]}
                name="code_accessary"
                label="Mã phụ tùng"
              >
                <Input placeholder="Mã phụ tùng" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên"
                name="name_accessary"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên",
                  },
                ]}
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Kho hàng"
                name="warehouse_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kho hàng",
                  },
                ]}
              >
                <Select
                  allowClear
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  // onSearch={(value) => {
                  //   if (value.match(/^0[0-9]{9}$/)) {
                  //     handleSearch(value);
                  //   }
                  // }}
                  onClear={() => {
                    store.dispatch(
                      getListWareHouse({
                        currentPage: 1,
                        pageSize: pageSizeScroll,
                        value: null,
                      })
                    );
                  }}
                  loading={isLoadWarehouse}
                  placeholder="Vui lòng chọn kho hàng"
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
          </Row>

          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Đơn vị tính"
                name="unit"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn vị tính",
                  },
                ]}
              >
                <Input placeholder="Đơn vị tính" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Số lượng"
                name="inventory_quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "Số lượng chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Số lượng" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn giá",
                  },
                ]}
                name="price"
                label="Đơn giá"
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Đơn giá"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                name="supplier_id"
                label="Nhà cung cấp"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn nhà cung cấp",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadAllSupplier}
                  placeholder="Vui lòng chọn nhà cung cấp"
                  options={optionsSupplier}
                />
              </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập ngưỡng số lượng",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "Ngưỡng số lượng chưa đúng định dạng!",
                  },
                ]}
                name="threshold_quantity"
                label="Ngưỡng số lượng"
              >
                <Input placeholder="Ngưỡng số lượng" />
              </Form.Item>
            </Col> */}
            <Col sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn loại  ",
                  },
                ]}
                name="type"
                label="Loại"
              >
                <Radio.Group>
                  <Space direction="horizontal">
                    <Radio value={"PhuTung"}>Phụ tùng</Radio>
                    <Radio value={"PhuKien"}>Phụ kiện</Radio>
                    <Radio value={"VatTu"}>Vật tư</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập tên tiếng anh",
                  },
                ]}
                name="name_eng"
                label="Tên tiếng anh"
              >
                <Input placeholder="Tên tiếng anh" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Model"
                name="model"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập model",
                  },
                ]}
              >
                <Input placeholder="Model" />
              </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tiền trả thợ"
                name="pay_money"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập mã thay thế",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Tiền trả thợ"
                />
              </Form.Item>
            </Col> */}
          </Row>
          <Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<PlusCircleOutlined />}
              >
                Thêm mới
              </Button>
            </Form.Item>
            <Button
              type="primary"
              danger
              onClick={handleCancel}
              icon={<CloseCircleOutlined />}
              style={{ marginLeft: 8 }}
            >
              Hủy
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
