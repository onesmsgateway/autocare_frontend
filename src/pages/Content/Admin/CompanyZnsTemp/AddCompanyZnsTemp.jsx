import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import useAddHandler from "../../../../components/CustomHooks/useAddHandler";
import { store } from "../../../../redux/configStores";
import { createCompanyZnsTemp, getListCompanyZnsTemp } from "../../../../services/admin/companyZnsTemp/companyZnsTemp";
import { useSelector } from "react-redux";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import { getAllListCompany, getListCompany } from "../../../../services/admin/company/company";
import { useEffect } from "react";
const { Option } = Select;
export default function AddCompanyZnsTemp({ currentPage, pageSize }) {
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(createCompanyZnsTemp, getListCompanyZnsTemp, currentPage, pageSize);
  const { loadingScroll, handlePopupScroll, pageSizeScroll } =
    usePaginationSelect(getListCompanyZnsTemp);
  const { allListCompany, isLoadCompanyComplete } = useSelector(
    (state) => state.company
  );

  const options = allListCompany?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });


  useEffect(() => {
    if (allListCompany?.data === undefined) store.dispatch(getAllListCompany());
  }, []);

  console.log('options', options);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Gắn zns temp"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addCompanyZnsTemp"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Chọn công ty"
                name="company_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chọn công ty",
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
                  onClear={() => {
                    store.dispatch(
                      getListCompany({
                        currentPage: 1,
                        pageSize: pageSizeScroll,
                        value: null,
                      })
                    );
                  }}
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
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                label="Temp ID"
                name="temp_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập temp id",
                  },
                ]}
              >
                <Input placeholder="temp id" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                label="Loại gửi tin zns"
                name="zns_type"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại tin zns",
                  },
                ]}
              >
                <Select placeholder="zns type">
                  <Select.Option value={"Thong ke hang ngay"}>Thống kê doanh thu hàng ngày</Select.Option>
                  <Select.Option value={"Dat lich bao duong"}>Đặt lịch bảo dưỡng</Select.Option>
                  <Select.Option value={"Dang bao duong"}>Đang bảo dưỡng</Select.Option>
                  <Select.Option value={"Da bao duong va thanh toan"}>Đã bảo dưỡng và thanh toán</Select.Option>
                  <Select.Option value={"Cam on bao duong"}>Cảm ơn bảo dưỡng</Select.Option>
                  <Select.Option value={"Hoa don bao duong"}>Hóa đơn bảo dưỡng</Select.Option>
                  <Select.Option value={"Bao duong dinh ky"}>Bảo dưỡng định kỳ</Select.Option>
                  <Select.Option value={"Bao duong dich vu"}>Bảo dưỡng dịch vụ</Select.Option>
                  <Select.Option value={"Cam on mua xe"}>Cảm ơn mua xe</Select.Option>
                  <Select.Option value={"Chuc mung sinh nhat"}>Chúc mừng sinh nhật</Select.Option>
                  <Select.Option value={"Otp"}>Otp</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
