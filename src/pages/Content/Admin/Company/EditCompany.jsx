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
  Typography,
} from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../../components/CustomHooks/useEditHandler";
import {
  editCompany,
  getListCompany,
} from "../../../../services/admin/company/company";

const { Option } = Select;
const EditCompany = forwardRef(function EditCompany(props, ref) {
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
    editCompany,
    getListCompany,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
  useEffect(() => {
    if (updateRecord) {
      form.setFieldsValue({
        name: updateRecord.name,
        address: updateRecord.address,
        phone: updateRecord.phone,
        secret_key: updateRecord.secret_key,
        quota_provider: updateRecord.quota_provider,
        quota_remain: updateRecord.quota_remain,
        manager_name: updateRecord.manager_name,
        software_package: updateRecord.software_package,
        maintain_message_amount: updateRecord.maintain_message_amount,
        user_zns: updateRecord.user_zns,
        oa_zns: updateRecord.oa_zns
        // pass_zns: "Viettel",
        // template_zns_maintain_schedule_reminder: "Viettel",
        // teamplate_zns_thank_maintain_schedule: "Viettel",
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
        title="Sửa công ty"
        open={isModalOpenEdit}
        footer={null}
        width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editCompany"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
           <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên công ty"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công ty",
                  },
                ]}
              >
                <Input placeholder="Tên công ty" />
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
            {/* <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Key"
                name="secret_key"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập tên công ty",
                  },
                ]}
              >
                <Input placeholder="Mã key" />
              </Form.Item>
            </Col> */}
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
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="OA Zns"
                name="oa_zns"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập oa zns",
                  },
                ]}
              >
                <Input placeholder="OA Zns" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
           
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                label="User Zns"
                name="user_zns"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập user zns",
                  },
                ]}
              >
                <Input placeholder="User Zns" />
              </Form.Item>
            </Col>
          </Row>
          <Row><Typography.Text type="secondary" style={{ fontSize: "12px" }}>Thông tin đăng nhập phục vụ cho việc gửi tin nhắn Zalo.</Typography.Text></Row>
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

EditCompany.displayName = "EditCompany";

export default EditCompany;
