import { forwardRef, useEffect, useState } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import { reGexLicensePlates } from "../../../utils/config";
import { editMotorStore, getListMotorStore } from "../../../services/motorStore/motorStore";
const { Option } = Select;
const FormEditCarStore = forwardRef(function FormEditCarStore(props, ref) {
  const { currentPage, pageSize, record } = props;
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
    editMotorStore,
    getListMotorStore,
    dispatch,
    ref,
    currentPage,
    pageSize,
    formatValues
  );

  useEffect(() => {
    form.setFieldsValue({
      store_id: updateRecord?.store_id,
      name_bike: updateRecord?.name_bike,
      // license_plate: updateRecord?.license_plate,
      frame_number: updateRecord?.frame_number,
      machine_number: updateRecord?.machine_number,
      maintain_quantity: updateRecord?.maintain_quantity,
      warranty_number: updateRecord?.warranty_number,
      motor_price: updateRecord?.motor_price,
      quantity: updateRecord?.quantity
    });
  }, [updateRecord, form, isModalOpenEdit]);
  
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
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên xe",
                  },
                ]}
                name="name_bike"
                label="Tên xe"
              >
                <Input placeholder="Tên xe" />
              </Form.Item>
            </Col>
            {/* <Col xl={12} lg={12} md={12} sm>
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
            </Col> */}
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Số khung"
                name="frame_number"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số khung",
                  },

                ]}
              >
                <Input placeholder="Số khung" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số máy ",
                  },
                ]}
                name="machine_number"
                label="Số máy"
              >
                <Input placeholder="Số máy" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số bảo hành ",
                  },
                ]}
                name="warranty_number"
                label="Số bảo hành"
              >
                <Input placeholder="Số bảo hành" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng xe",
                  },
                ]}
              >
                <InputNumber placeholder="Số lượng" />
              </Form.Item>
            </Col>
          </Row>

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

FormEditCarStore.displayName = "FormEditCarStore";

export default FormEditCarStore;
