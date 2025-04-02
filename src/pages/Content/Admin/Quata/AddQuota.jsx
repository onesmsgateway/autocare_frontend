import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Select,
  Modal,
  Row,
  Skeleton,
  InputNumber,
  Typography,
  message,
} from "antd";
import { useSelector } from "react-redux";
import {
  getAllListCompany,
  getCompanyDetail,
  getListCompany,
} from "../../../../services/admin/company/company";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import { store } from "../../../../redux/configStores";
import {
  createQuata,
  getListQuata,
} from "../../../../services/admin/quota/quota";
import { useEffect, useState } from "react";
const { Option } = Select;
export default function AddQuota({ currentPage, pageSize }) {
  const [showQuota, setShowQuota] = useState();
  const [formAdd] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await store.dispatch(createQuata(values));
      if (createQuata.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm thành công");
        handleCancel();
        formAdd.resetFields();
        await store.dispatch(getListQuata({ currentPage, pageSize }));
        setShowQuota(undefined);
      } else if (createQuata.rejected.match(response)) {
        setIsLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(errorMessage);
            });
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const { allListCompany, isLoadCompanyComplete } = useSelector(
    (state) => state.company
  );
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCompany);
  const options = allListCompany?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  const handleShowQuota = async (value) => {
    const res = await store.dispatch(getCompanyDetail(value));
    setShowQuota(res.payload?.data?.quota_remain);
  };
  // const handleSearch = (value) => {
  //   if (!value) return;
  //   try {
  //     store.dispatch(
  //       getListCompany({ currentPage: 1, pageSize: pageSizeScroll, value })
  //     );
  //   } catch (error) {
  //     console.error("Error occurred while searching:", error);
  //   }
  // };
  useEffect(() => {
    store.dispatch(getAllListCompany());
  }, []);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm Quota"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addQuota"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                label="Công ty"
                name="company_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn công ty",
                  },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  //   onSearch={(value) => {
                  //     if (value.match(/^0[0-9]{9}$/)) {
                  //       handleSearch(value);
                  //     }
                  //   }}
                  onClear={() => {
                    store.dispatch(
                      getListCompany({
                        currentPage: 1,
                        pageSize: pageSizeScroll,
                        value: null,
                      })
                    );
                  }}
                  onChange={handleShowQuota}
                  loading={isLoadCompanyComplete}
                  placeholder="Vui lòng chọn công ty"
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
              {showQuota !== undefined && (
                <Typography style={{ margin: "10px 0" }}>
                  Số quota còn lại:{" "}
                  <Typography.Link>
                    {showQuota?.toLocaleString("vi-VN")}
                  </Typography.Link>
                </Typography>
              )}
            </Col>

            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Số quota"
                name="qty_quota_granted"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số quota",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Số quota"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Ghi chú"
            name="notes"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input.TextArea placeholder="Ghi chú" />
          </Form.Item>
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
        </Form>
      </Modal>
    </div>
  );
}
