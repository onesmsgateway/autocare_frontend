import { forwardRef, useEffect } from "react";
import { EditOutlined, SyncOutlined, LockOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Select,
  Modal,
  Row,
  Tooltip,
  Skeleton,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import useEditHandler from "../../../../components/CustomHooks/useEditHandler";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import {
  getAllListCompany,
  getListCompany,
} from "../../../../services/admin/company/company";
import { store } from "../../../../redux/configStores";
import {
  editAccount,
  getListAccount,
} from "../../../../services/admin/account/account";
const { Option } = Select;
const EditAccount = forwardRef(function EditAccount(props, ref) {
  const { currentPage, pageSize, record } = props;
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
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  } = useEditHandler(
    editAccount,
    getListAccount,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
  console.log('company',options);
  useEffect(() => {
    form.setFieldsValue({
      company_id: updateRecord?.company_id,
      username: updateRecord?.username,
      phone: updateRecord?.phone,
    });
  }, [updateRecord, form, isModalOpenEdit]);
  useEffect(() => {
    if (allListCompany?.data === null) store.dispatch(getAllListCompany());
  }, []);
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
        title="Sửa tài khoản"
        open={isModalOpenEdit}
        footer={null}
        width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editAccount"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
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

EditAccount.displayName = "EditAccount";

export default EditAccount;
