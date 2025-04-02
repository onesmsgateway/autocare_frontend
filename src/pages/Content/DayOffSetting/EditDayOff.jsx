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
  message,
} from "antd";
import { useDispatch } from "react-redux";
import {
  getListDayOffSetting,
  updateDayOff,
} from "../../../services/timekeeping/timekeeping";

const EditDayOff = forwardRef(function EditStaff(props, ref) {
  const {
    currentPage,
    pageSize,
    record,
    company_id,
    search,
    optionsLeaveTypeSetting,
    isLoadListLeaveTypeSetting,
    optionsListEmployee,
    isLoadListAllEmployee,
  } = props;

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [updateRecord, setUpdateRecord] = useState();
  const [isEditLoading, setEditLoading] = useState(false);
  const showModalEdit = useCallback((record) => {
    setIsModalOpenEdit(true);
    setUpdateRecord(record); // Cập nhật record khi showModalEdit được gọi
  }, []);
  const handleCancelEdit = useCallback(() => {
    setIsModalOpenEdit(false);
  }, []);
  useImperativeHandle(ref, () => ({
    showModalEdit,
    handleCancelEdit,
  }));

  const onFinish = async (values) => {
    const data = {
      id: updateRecord?.id,
      ...values,
      stock: Number(values.leave_stock),
    };
    setEditLoading(true);
    try {
      const response = await dispatch(updateDayOff(data));
      if (updateDayOff.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(
          getListDayOffSetting({
            currentPage,
            pageSize,
            company_id,
            search,
          })
        );
      } else if (updateDayOff.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.error) {
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        employee_id: updateRecord.employee_id,
        leave_type_id: updateRecord.leave_type_id,
        leave_stock: updateRecord.leave_stock,
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
        title="Sửa ngày nghỉ"
        open={isModalOpenEdit}
        footer={null}
        centered
        onCancel={handleCancelEdit}
      >
        <Form
          name="editDayOff"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="employee_id"
                label="Nhân viên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn nhân viên",
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
                  disabled={isLoadListAllEmployee}
                  placeholder="Vui lòng chọn nhân viên"
                  options={optionsListEmployee}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="leave_type_id"
                label="Loại nghỉ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại nghỉ",
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
                  disabled={isLoadListLeaveTypeSetting}
                  placeholder="Vui lòng chọn loại nghỉ"
                  options={optionsLeaveTypeSetting}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item
              label="Số ngày nghỉ"
              name="leave_stock"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số ngày nghỉ",
                },
              ]}
            >
              <Input placeholder="Số ngày nghỉ" type="number" />
            </Form.Item>
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

EditDayOff.displayName = "EditDayOff";

export default EditDayOff;
