import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Tooltip, message } from "antd";
import { useDispatch } from "react-redux";
import {
  editSupplier,
  getListSupplier,
} from "../../../services/supplier/supplier";
import { reGexIsNumber, reGexPhone } from "../../../utils/config";
const EditSupplier = forwardRef(function EditSupplier(props, ref) {
  const { currentPage, pageSize, record } = props;
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (isModalOpenEdit && updateRecord) {
      form.setFieldsValue({
        name: updateRecord?.name,
        address: updateRecord?.address,
        phone: updateRecord?.phone,
        email: updateRecord?.email,
        tax_code: updateRecord?.tax_code,
        delegater: updateRecord?.delegater,
      });
    }
  }, [isModalOpenEdit, updateRecord, form]);
  const onFinish = async (values) => {
    const data = {
      id: updateRecord?.id,
      ...values,
    };
    setEditLoading(true);
    try {
      const response = await dispatch(editSupplier(data));
      if (editSupplier.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(getListSupplier({ currentPage, pageSize }));
      } else if (editSupplier.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      setEditLoading(false);
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
        title="Sửa nhà cung cấp"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="addSupplier"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Tên nhà cung cấp"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhà cung cấp",
                  },
                ]}
              >
                <Input placeholder="Tên nhà cung cấp" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ ",
                  },
                ]}
                name="address"
                label="Địa chỉ"
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern: reGexPhone,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập email ",
                  },
                  {
                    type: "email",
                    message: "Email chưa đúng định dạng!",
                  },
                ]}
                name="email"
                label="Email"
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Mã số thuế"
                name="tax_code"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập mã số thuế",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "Mã số thuế chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Mã số thuế" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập người đại diện ",
                  },
                ]}
                name="delegater"
                label="Người đại diện"
              >
                <Input placeholder="Người đại diện" />
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

EditSupplier.displayName = "EditSupplier";

export default EditSupplier;
