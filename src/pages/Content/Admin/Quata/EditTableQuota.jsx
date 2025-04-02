import { forwardRef, useEffect } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../../components/CustomHooks/useEditHandler";
import {
  editQuota,
  getListQuata,
} from "../../../../services/admin/quota/quota";

const EditTableQuota = forwardRef(function EditTableQuota(props, ref) {
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
    editQuota,
    getListQuata,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
  useEffect(() => {
    form.setFieldsValue({
      notes: updateRecord?.notes,
    });
  }, [updateRecord, form,isModalOpenEdit]);
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
        title="Sửa ghi chú"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="addQuota"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Form.Item
            label="Ghi chú"
            name="notes"
            rules={[
              {
                required: false,
              },
            ]}
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

EditTableQuota.displayName = "EditTableQuota";

export default EditTableQuota;
