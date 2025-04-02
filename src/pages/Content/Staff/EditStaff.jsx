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
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tooltip,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { editStaff, getListStaff } from "../../../services/staff/staff";
import { reGexPhone } from "../../../utils/config";
const EditStaff = forwardRef(function EditStaff(props, ref) {
  const {
    currentPage,
    pageSize,
    record,
    optionsDepartMent,
    // optionsStore,
    optionsPosition,
    optionsAccountTimekeeping,
    isLoadAccountTimekeeping,
    // isLoadStoresAll,
    isLoadingAllPositions,
    isLoadAllDepartments,
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
  //   console.log(updateRecord)
  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        name: updateRecord.name,
        position_id: updateRecord.position_id
          ? updateRecord.position_id
          : undefined,
        department_id: updateRecord.department_id
          ? updateRecord.department_id
          : undefined,
        phone: updateRecord.phone,
        cccd: updateRecord.cccd,
        birth_day: updateRecord?.birth_day
          ? dayjs(updateRecord?.birth_day)
          : undefined,
        end_user_machine_id: updateRecord.end_user_machine_id,
      });
    }
  }, [updateRecord, form, isModalOpenEdit]);

  const onFinish = async (values) => {
    const data = {
      id: updateRecord?.id,
      ...values,
      birth_day: values["birth_day"]?.format("YYYY-MM-DD"),
    };
    setEditLoading(true);
    try {
      const response = await dispatch(editStaff(data));
      if (editStaff.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(getListStaff({ currentPage, pageSize }));
      } else if (editStaff.rejected.match(response)) {
        setEditLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      setEditLoading(false);
    }
  };

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
        title="Sửa nhân viên"
        open={isModalOpenEdit}
        footer={null}
        centered
        onCancel={handleCancelEdit}
      >
        <Form
          name="editStaff"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Tên nhân viên"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhân viên",
                  },
                ]}
              >
                <Input placeholder="Tên nhân viên" />
              </Form.Item>
            </Col>
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
                    pattern: reGexPhone,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input disabled placeholder="Số điện thoại" />
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
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                name="department_id"
                label="Bộ phận"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn bộ phận",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadAllDepartments}
                  placeholder="Vui lòng chọn bộ phận"
                  options={optionsDepartMent}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="position_id"
                label="Chức vụ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chức vụ",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadingAllPositions}
                  placeholder="Vui lòng chọn chức vụ"
                  options={optionsPosition}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="CCCD"
                name="cccd"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập căn cước công dân",
                  },
                  {
                    pattern: /^[0-9]{12}$/,
                    message: "Số căn cước công dân chưa đúng định dạng!",
                  },
                ]}
              >
                <Input placeholder="Căn cước công dân" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Form.Item
                name="end_user_machine_id"
                label="Tài khoản chấm công"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn tài khoản",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadAccountTimekeeping}
                  placeholder="Vui lòng chọn tài khoản"
                  options={optionsAccountTimekeeping}
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

EditStaff.displayName = "EditStaff";

export default EditStaff;
