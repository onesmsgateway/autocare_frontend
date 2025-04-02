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
  getListCategoryPost,
  updateCategoryPost,
} from "../../../services/post/post";

const { TextArea } = Input;

const EditCategoryPost = forwardRef(function EditCategoryPost(props, ref) {
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
      const response = await dispatch(updateCategoryPost(data));
      if (updateCategoryPost.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(
          getListCategoryPost({
            currentPage,
            pageSize,
            search,
          })
        );
      } else if (updateCategoryPost.rejected.match(response)) {
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
        title="Sửa loại bài viết"
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
                label="Tên loại bài viết"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại bài viết",
                  },
                ]}
              >
                <Input placeholder="Tên loại bài viết" />
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
                    message: "Vui lòng nhập mô tả loại bài viết",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả loại bài viết" />
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

EditCategoryPost.displayName = "EditCategoryPost";

export default EditCategoryPost;
