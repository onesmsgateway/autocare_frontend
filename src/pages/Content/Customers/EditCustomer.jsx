import { forwardRef, useEffect } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  editCustomer,
  getListCustomer,
} from "../../../services/customer/customer";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import { reGexIsNumber, reGexPhone } from "../../../utils/config";
const { Option } = Select;
const EditCustomer = forwardRef(function EditCustomer(props, ref) {
  const { currentPage, pageSize, record } = props;
  const { allListgroupCustomer, isLoadingAll } = useSelector(
    (state) => state.groupCustomer
  );
  const options = allListgroupCustomer?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const dispatch = useDispatch();
  const [formEdit] = Form.useForm();
  const formatValues = (values) => {
    return {
      ...values,
      birth_day: values["birth_day"]
        ? values["birth_day"].format("YYYY-MM-DD")
        : null, // Trả về null nếu birth_day không tồn tại
    };
  };

  const {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  } = useEditHandler(
    editCustomer,
    getListCustomer,
    dispatch,
    ref,
    currentPage,
    pageSize,
    formatValues
  );
  useEffect(() => {
    formEdit.setFieldsValue({
      full_name: updateRecord?.full_name,
      gender: updateRecord?.gender,
      birth_day: updateRecord?.birth_day ? dayjs(updateRecord?.birth_day): undefined,
      phone: updateRecord?.phone,
      group_id: updateRecord?.group_id,
      address: updateRecord?.address,
      citizen_identification: updateRecord?.citizen_identification,
      warranty_number: updateRecord?.warranty_number,
      category: updateRecord?.category,
    });
  }, [updateRecord, formEdit, isModalOpenEdit]);
  console.log('updateRe', updateRecord);
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
        title="Sửa khách hàng"
        open={isModalOpenEdit}
        footer={null}
        width={650}
        centered
        onCancel={handleCancelEdit}
      >
        <Form
          name="editCustomer"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formEdit}
        >
          <Row gutter={[8, 8]}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên khách hàng"
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khách hàng",
                  },
                ]}
              >
                <Input placeholder="Tên khách hàng" />
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
                    pattern: reGexPhone,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính",
                  },
                ]}
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Vui lòng chọn giới tính">
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Ngày sinh"
                name="birth_day"
                rules={[
                  {
                    type: "object",
                    required: false,
                    message: "Vui lòng chọn ngày sinh",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập địa chỉ",
                  },
                ]}
                name="address"
                label="Địa chỉ"
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="CMND/CCCD"
                name="citizen_identification"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập CMND",
                  },
                  {
                    pattern: reGexIsNumber,
                    message: "CMND/CCCD chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Căn cước công dân" />
              </Form.Item>
            </Col>
            {/* <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Nhóm khách hàng"
                name="group_id"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn khách hàng",
                  },
                ]}
              >
                <Select
                  showSearch
                  options={options}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  virtual
                  loading={isLoadingAll}
                  disabled={isLoadingAll}
                  placeholder="Vui lòng chọn nhóm khách hàng"
                />
              </Form.Item>
            </Col> */}
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

EditCustomer.displayName = "EditCustomer";

export default EditCustomer;
