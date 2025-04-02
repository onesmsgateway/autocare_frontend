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
  editPosition,
  getListPosition,
} from "../../../services/position/position";

const { TextArea } = Input;

const EditPosition = forwardRef(function EditPosition(props, ref) {
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
      const response = await dispatch(editPosition(data));
      if (editPosition.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(
          getListPosition({
            currentPage,
            pageSize,
            search,
          })
        );
      } else if (editPosition.rejected.match(response)) {
        setEditLoading(false);
        if (response?.payload?.response?.data?.errors?.name) {
          message.error(response?.payload?.response?.data?.errors?.name);
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
        content: updateRecord.content,
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
        title="Sửa chức vụ"
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
                label="Tên chức vụ"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên chức vụ",
                  },
                ]}
              >
                <Input placeholder="Tên chức vụ" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24}>
              <Form.Item
                label="Mô tả"
                name="content"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập mô tả chức vụ",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả chức vụ" />
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

EditPosition.displayName = "EditPosition";

export default EditPosition;
