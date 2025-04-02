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
  editDepartment,
  getListDepartments,
} from "../../../services/department/department";

const { TextArea } = Input;


const EditDepartment = forwardRef(function EditDepartment(props, ref) {
  const { currentPage, pageSize, record, search } = props;

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

  const onFinish = async (values) => {
    const data = {
      id: updateRecord?.id,
      ...values,
    };
    setEditLoading(true);
    try {
      const response = await dispatch(editMaintenanceDebt(data));
      if (editMaintenanceDebt.fulfilled.match(response)) {
        console.log(response);
        message.success("Cập nhật thành công");
        // Reload danh sách mà không hiển thị thông báo
        await dispatch(
          getListMaintenanceDebt({
            currentPage,
            pageSize,
            search,
          })
        );
        setEditLoading(false);
        handleCancelEdit();
      } else if (editMaintenanceDebt.rejected.match(response)) {
        // Xử lý lỗi trả về từ API
        setEditLoading(false);
        const errorMessage =
          response?.payload?.response?.data?.error ||
          response?.payload?.error ||
          "Đã xảy ra lỗi trong quá trình xử lý.";
        message.error(errorMessage);
      }
    } catch (error) {
      // Xử lý lỗi ngoài dự kiến
      console.log('Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi trong quá trình xử lý.";
      message.error(errorMessage);
      setEditLoading(false);
    }

  };

  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        name: updateRecord.name,
        note: updateRecord.note,
      });
    }
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
        title="Sửa bộ phận"
        open={isModalOpenEdit}
        footer={null}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editLeaveType"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Tên bộ phận"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên bộ phận",
                  },
                ]}
              >
                <Input placeholder="Tên bộ phận" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Mô tả"
                name="note"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập mô tả bộ phận",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả bộ phận" />
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

EditDepartment.displayName = "EditDepartment";

export default EditDepartment;
