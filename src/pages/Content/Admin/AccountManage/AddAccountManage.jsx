import { PlusCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Select, Modal, Row } from "antd";
import { useSelector } from "react-redux";
import useAddHandler from "../../../../components/CustomHooks/useAddHandler";
// import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import { store } from "../../../../redux/configStores";
import { useEffect } from "react";
import {
  getAllListCompanyBranch
  // getAllListCompanyBranchNoManager,
  // getListCompanyBranch,
} from "../../../../services/admin/companyBranch/companyBranch";
import {
  createAccountManage,
  getListAccountManage,
} from "../../../../services/admin/accountManage/accountManage";
const { Option } = Select;
export default function AddAccount({ currentPage, pageSize }) {
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(
      createAccountManage,
      getListAccountManage,
      currentPage,
      pageSize,
      false,
      getAllListCompanyBranch
    );
  const {
    allListCompanyBranch,
    isLoadCompanyBranchComplete,
  } = useSelector((state) => state.companyBranch);
  // const { loadingScroll, handlePopupScroll, pageSizeScroll } =
  //   usePaginationSelect(getListCompanyBranch);
  const options = allListCompanyBranch?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });
  useEffect(() => {
    if (allListCompanyBranch?.data === null)
      store.dispatch(getAllListCompanyBranch());
  }, []);
  console.log('listCompanyBranch', getAllListCompanyBranch);
  console.log('options', options);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Tạo tài khoản khách hàng"
        open={isModalOpen}
        footer={null}
        width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addAccount"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Công ty"
                name="company_id"
                rules={[
                  {
                    required: false,
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
                  // onClear={() => {
                  //   store.dispatch(
                  //     getListCompanyBranch({
                  //       currentPage: 1,
                  //       pageSize: pageSizeScroll,
                  //       value: null,
                  //     })
                  //   );
                  // }}
                  loading={isLoadCompanyBranchComplete}
                  placeholder="Vui lòng chọn công ty"
                  // onPopupScroll={handlePopupScroll}
                >
                  {options?.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                  {/* {loadingScroll && (
                    <Option key="loading" disabled>
                      <Skeleton active paragraph={{ rows: 1 }} />
                    </Option>
                  )} */}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Tên tài khoản"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên tài khoản",
                  },
                ]}
              >
                <Input placeholder="Tên tài khoản" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Mật khẩu"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="password_confirmation"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu chưa khớp "));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Nhập lại mật khẩu"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern: /^0[0-9]{9}$/,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" />
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
