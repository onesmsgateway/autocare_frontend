import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import { store } from "../../../redux/configStores";
import {
  createPost,
  getListPost,
  uploadImageCategoryPost,
} from "../../../services/post/post";

const { TextArea } = Input;

export default function AddPostSetting({
  currentPage,
  pageSize,
  company_id,
  search,
  optionsCategoryPost,
  isLoadListCategoryPost,
}) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null); // Lưu file ảnh đã chọn

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setImageUrl("");
    setImageFile(null);
  };

  const handleImagePreview = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result); // Hiển thị preview ảnh
    };
    reader.readAsDataURL(file);
    setImageFile(file); // Lưu file ảnh để sử dụng khi ấn nút "Thêm mới"
  };

  const onFinish = async (fieldsValue) => {
    setIsLoading(true);
    try {
      let values = {
        ...fieldsValue,
        company_id: company_id,
      };

      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadResponse = await store.dispatch(
        uploadImageCategoryPost(formData)
      );

      if (uploadImageCategoryPost.fulfilled.match(uploadResponse)) {
        values = {
          ...fieldsValue,
          company_id,
          image: uploadResponse?.payload?.data, // Sử dụng đường dẫn ảnh trả về từ upload API
          content: "content",
          status: true,
        };
        const response = await store.dispatch(createPost(values));
        if (createPost.fulfilled.match(response)) {
          setIsLoading(false);
          message.success("Thêm bài viết thành công");
          handleCancel();
          form.resetFields();
          await store.dispatch(
            getListPost({
              currentPage,
              pageSize,
              search,
            })
          );
        } else if (createPost.rejected.match(response)) {
          setIsLoading(false);
          if (response.payload.error) {
            message.error(response.payload.error);
          }
        }
      } else if (uploadImageCategoryPost.rejected.match(uploadResponse)) {
        setIsLoading(false);
        message.error("Tải ảnh thất bại");
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm bài viết"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addLeaveTypeSetting"
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
