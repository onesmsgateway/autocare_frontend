import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Tooltip,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import {
  editGroupCustomer,
  getListGroupCustomer,
} from "../../../services/groupCustomer/groupCustomer";
const EditGroupCustomer = forwardRef(function EditGroupCustomer(props, ref) {
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
    form.setFieldsValue({
      company_id: updateRecord?.company_id,
      name: updateRecord?.name,
    });
  }, [updateRecord, form,isModalOpenEdit]);

  const onFinish = async (values) => {
    const data = {
      id: updateRecord?.id,
      ...values,
    };
    setEditLoading(true);
    try {
      const response = await dispatch(editGroupCustomer(data));
      if (editGroupCustomer.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(getListGroupCustomer({ currentPage, pageSize }));
      } else if (editGroupCustomer.rejected.match(response)) {
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
        title="Sửa nhóm khách hàng"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editGroupCustomer"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Form.Item
            label="Tên nhóm"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên nhóm khách hàng",
              },
            ]}
          >
            <Input placeholder="Tên nhóm khách hàng" />
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

EditGroupCustomer.displayName = "EditGroupCustomer";

export default EditGroupCustomer;
