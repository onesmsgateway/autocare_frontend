import { forwardRef, useEffect } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,

  Tooltip,
} from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import { editJobCateGory, getListJobCateGory } from "../../../services/jobCateGory/jobCateGory";

const EditJobCategory = forwardRef(function EditJobCategory(props, ref) {
  const { currentPage, pageSize, record,  } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    isModalOpenEdit,
    onFinish,
    isEditLoading,
    updateRecord,
    showModalEdit,
    handleCancelEdit,
  } = useEditHandler(editJobCateGory, getListJobCateGory, dispatch, ref, currentPage, pageSize);
  useEffect(() => {
    if (updateRecord && isModalOpenEdit) {
      form.setFieldsValue({
        company_id: updateRecord?.company_id,
        employee_id: updateRecord?.employee_id,
        maintenance_id: updateRecord?.maintenance_id,
        content: updateRecord?.content,
        name: updateRecord?.name,
        wage: updateRecord?.wage,
        note: updateRecord?.note,
      });
    }
  }, [updateRecord, form, isModalOpenEdit]);
  // console.log(showMainTain)
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
        title="Sửa công việc"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editJob"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
         <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên công việc ",
                  },
                ]}
                name="name"
                label="Tên công việc"
              >
                <Input placeholder="Nội dung công việc" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiền công ",
                  },
                ]}
                name="wage"
                label="Tiền công"
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Tiền công"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            rules={[
              {
                required: false,
                message: "Vui lòng nhập ghi chú ",
              },
            ]}
            name="note"
            label="
            Ghi chú"
          >
            <Input.TextArea placeholder="Ghi chú" />
          </Form.Item>
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

EditJobCategory.displayName = "EditJobCategory";

export default EditJobCategory;
