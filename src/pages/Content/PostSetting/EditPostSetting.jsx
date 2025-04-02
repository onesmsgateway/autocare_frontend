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
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import {
  getListPost,
  updatePost,
  uploadImageCategoryPost,
} from "../../../services/post/post";
import { ConvertUrlImage } from "../../../utils/dateTime";

const { TextArea } = Input;

const EditPostSetting = forwardRef(function EditPostSetting(props, ref) {
  const {
    currentPage,
    pageSize,
    record,
    search,
    optionsCategoryPost,
    isLoadListCategoryPost,
  } = props;

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [updateRecord, setUpdateRecord] = useState();
  const [isEditLoading, setEditLoading] = useState(false);

  const [initialImage, setInitialImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null); // Lưu file ảnh đã chọn

  const showModalEdit = useCallback((record) => {
    setIsModalOpenEdit(true);
    setUpdateRecord(record); // Cập nhật record khi showModalEdit được gọi
    const convertImage = ConvertUrlImage(record?.image);
    setInitialImage(convertImage);
  }, []);
  const handleCancelEdit = useCallback(() => {
    setIsModalOpenEdit(false);
  }, []);
  useImperativeHandle(ref, () => ({
    showModalEdit,
    handleCancelEdit,
  }));

  const handleImagePreview = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result); // Hiển thị preview ảnh
    };
    reader.readAsDataURL(file);
    setImageFile(file); // Lưu file ảnh để sử dụng khi ấn nút "Thêm mới"
  };

  const onFinish = async (fieldsValue) => {
    setEditLoading(true);
    try {
      let values = {
        id: updateRecord?.id,
        ...fieldsValue,
      };

      // Check if the image has been updated
      if (imageFile && imageUrl !== initialImage) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResponse = await dispatch(
          uploadImageCategoryPost(formData)
        );

        if (uploadImageCategoryPost.fulfilled.match(uploadResponse)) {
          values.image = uploadResponse?.payload?.data;
        } else {
          setEditLoading(false);
          message.error("Tải ảnh thất bại");
          return;
        }
      }

      values.content = "content";

      const response = await dispatch(updatePost(values));
      if (updatePost.fulfilled.match(response)) {
        message.success("Cập nhật thành công");
        handleCancelEdit();
        form.resetFields();
        await dispatch(getListPost({ currentPage, pageSize, search }));
      } else if (updatePost.rejected.match(response)) {
        message.error(response.payload.error || "Cập nhật thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        post_category_id: updateRecord?.category?.id,
        title: updateRecord?.name,
        target: updateRecord?.target,
        summary: updateRecord?.description,
        image: updateRecord?.image,
      });
      const convertImage = ConvertUrlImage(updateRecord?.image);
      setImageUrl(convertImage);
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
        title="Sửa bài viết"
        open={isModalOpenEdit}
        footer={null}
        centered
        onCancel={handleCancelEdit}
      >
        <Form
          name="editLeaveType"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[12, 12]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="post_category_id"
                label="Loại bài viết"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn loại bài viết",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadListCategoryPost}
                  placeholder="Vui lòng chọn loại bài viết"
                  options={optionsCategoryPost}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                label="Tên bài viết"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên bài viết",
                  },
                ]}
              >
                <Input placeholder="Tên bài viết" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="target"
                label="Phạm vi hiển thị"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phạm vi",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  placeholder="Vui lòng chọn phạm vi"
                  options={[
                    {
                      value: "all",
                      label: "Tất cả",
                    },
                    {
                      value: "employees",
                      label: "Nhân viên",
                    },
                    {
                      value: "customers",
                      label: "Khách hàng",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                label="Mô tả ngắn"
                name="summary"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả ngắn",
                  },
                ]}
              >
                <TextArea placeholder="Mô tả ngắn" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item label="Chọn ảnh" name="image">
                <Upload
                  beforeUpload={(file) => {
                    handleImagePreview(file); // Hiển thị preview ảnh khi chọn
                    return false; // Ngăn không cho tự động upload ảnh
                  }}
                  showUploadList={false}
                >
                  <Button>Tải lên</Button>
                </Upload>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ marginTop: 10, maxWidth: "100%" }}
                  />
                )}
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

EditPostSetting.displayName = "EditPostSetting";

export default EditPostSetting;
