import { forwardRef, useEffect } from "react";
import { SyncOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Tooltip,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import useEditHandler from "../../../../components/CustomHooks/useEditHandler";
import {
  getAllListCompany,
  getListCompany,
} from "../../../../services/admin/company/company";
import { editCompanyZnsTemp, getListCompanyZnsTemp } from "../../../../services/admin/companyZnsTemp/companyZnsTemp";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";

const { Option } = Select;
const EditCompanyZnsTemp = forwardRef(function EditCompanyZnsTemp(props, ref) {
  const { currentPage, pageSize, record } = props;
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
    editCompanyZnsTemp,
    getListCompanyZnsTemp,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
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
  useEffect(() => {
    if (allListCompany?.data === null) store.dispatch(getAllListCompany());
  }, []);
  useEffect(() => {
    if (updateRecord) {
      form.setFieldsValue({
        company_id: updateRecord.company_id,
        temp_id: updateRecord.temp_id,
        zns_type: updateRecord.zns_type,
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
        title="Sửa thông tin zns temp"
        open={isModalOpenEdit}
        footer={null}
        width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editCompanyZnsTemp"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Chọn công ty"
                name="name"
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
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập địa chỉ",
                  },
                ]}
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
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
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Key"
                name="secret_key"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công ty",
                  },
                ]}
              >
                <Input placeholder="Mã key" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Người quản lý"
                name="manager_name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập người quản lý",
                  },
                ]}
              >
                <Input placeholder="Người quản lý" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Gói phần mềm"
                name="software_package"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn gói phần mềm",
                  },
                ]}
              >
                <Select allowClear placeholder="Vui lòng chọn gói phần mềm">
                  <Option value="Nhan tin">Nhắn tin</Option>
                  <Option value="Bao duong">Xưởng sữa chữa</Option>
                  <Option value="Full">Đầy đủ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="Số tiền nhắn tin BD"
                name="maintain_message_amount"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Số tiền"
                />
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

EditCompanyZnsTemp.displayName = "EditCompanyZnsTemp";

export default EditCompanyZnsTemp;
