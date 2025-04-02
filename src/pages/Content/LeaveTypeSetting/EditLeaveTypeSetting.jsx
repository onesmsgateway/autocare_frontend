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
  getListLeaveTypeSetting,
  updateLeaveType,
} from "../../../services/timekeeping/timekeeping";

const { TextArea } = Input;

const EditLeaveType = forwardRef(function EditStaff(props, ref) {
  const { currentPage, pageSize, record, company_id, search } = props;

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
      company_id,
      ...values,
    };
    setEditLoading(true);
    try {
      const response = await dispatch(updateLeaveType(data));
      if (updateLeaveType.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(
          getListLeaveTypeSetting({
            currentPage,
            pageSize,
            company_id,
            search,
          })
        );
      } else if (updateLeaveType.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.error) {
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        name: updateRecord.name,
        description: updateRecord.description,
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
        title="Sửa loại nghỉ"
        open={isModalOpenEdit}
        footer={null}
        // centered
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
                label="Tên loại nghỉ"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại nghỉ",
                  },
                ]}
              >
                <Input placeholder="Tên loại nghỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả loại nghỉ",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả loại nghỉ" />
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

EditLeaveType.displayName = "EditLeaveType";

export default EditLeaveType;
