import { RetweetOutlined } from "@ant-design/icons";
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import {
  getAllListCompany,
  getCompanyDetail,
  getListCompany,
} from "../../../../services/admin/company/company";
import { store } from "../../../../redux/configStores";
import {
  changeQuata,
  getListQuata,
} from "../../../../services/admin/quota/quota";
const { Option } = Select;
export default function ChangeQuota({ currentPage, pageSize }) {
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
  const [showQuota, setShowQuota] = useState();
  const [showQuota2, setShowQuota2] = useState();
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
      const response = await store.dispatch(changeQuata(values));
      if (changeQuata.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Chuyển thành công");
        handleCancel();
        formAdd.resetFields();
        await store.dispatch(getListQuata({ currentPage, pageSize }));
        setShowQuota(undefined);
        setShowQuota2(undefined);
      } else if (changeQuata.rejected.match(response)) {
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
  const handleShowQuota = async (value) => {
    const res = await store.dispatch(getCompanyDetail(value));
    setShowQuota(res.payload?.data?.quota_remain);
  };

  const handleShowQuota2 = async (value) => {
    const res = await store.dispatch(getCompanyDetail(value));
    setShowQuota2(res?.payload?.data?.quota_remain);
  };
  useEffect(() => {
    store.dispatch(getAllListCompany());
  }, []);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<RetweetOutlined />}>
        Chuyển Quota
      </Button>
      <Modal
        title="Chuyển Quota"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="changeQuota"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                label="Từ công ty"
                name="from_company_id"
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
                  //   options={options}
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
                label="Đến công ty"
                name="to_company_id"
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
                  onChange={handleShowQuota2}
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
              {showQuota2 !== undefined && (
                <Typography style={{ margin: "10px 0" }}>
                  Số quota còn lại:{" "}
                  <Typography.Link>
                    {showQuota2?.toLocaleString("vi-VN")}
                  </Typography.Link>
                </Typography>
              )}
            </Col>
          </Row>
          <Form.Item
            label="Số quota"
            name="qty_quota"
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
          {/* <Form.Item
            label="Ghi chú"
            name="notes"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input.TextArea placeholder="Ghi chú" />
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<RetweetOutlined />}
            >
              Chuyển Quota
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
