import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
  } from "react";
  import { EditOutlined, SyncOutlined } from "@ant-design/icons";
  import { Button, Col, Form, Input, Modal, Row, Tooltip, message } from "antd";
  import { useDispatch } from "react-redux";
  import {
      getDetailTimekeeping,
    updateNote,
  } from "../../../services/timekeeping/timekeeping";
import dayjs from "dayjs";
  
  const { TextArea } = Input;
  
  const UpdateNoteTimekeeping = forwardRef(function UpdateNoteTimekeeping(props, ref) {
    const { company_id, record, selectedDate, id } = props;
    const formattedMonth = dayjs(selectedDate).format("MM");
      const formattedYear = dayjs(selectedDate).format("YYYY");
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
        id: updateRecord?.employee_att_id,
        ...values,
      };
      console.log('dataUPDATED', data);
      
      setEditLoading(true);
      try {
        const response = await dispatch(updateNote(data));
        if (updateNote.fulfilled.match(response)) {
          setEditLoading(false);
          message.success("Cập nhật thành công");
          handleCancelEdit();
          await dispatch(
            getDetailTimekeeping({
                id,
                month: formattedMonth,
                year: formattedYear,
                company_id,
              })
          );
        } else if (updateNote.rejected.match(response)) {
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
          note: updateRecord.note,
        });
      }
    }, [updateRecord, form, isModalOpenEdit]);
  
    return (
      <div>
        <Tooltip placement="top" title="Sửa ghi chú">
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
          // centered
          onCancel={handleCancelEdit}
        >
          <Form
            name="UpdateNoteTimekeeping"
            onFinish={onFinish}
            layout="vertical"
            requiredMark=""
            form={form}
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item
                  label="Ghi chú"
                  name="note"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng nhập ghi chú",
                    },
                  ]}
                >
                  <TextArea placeholder="Ghi chú" />
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
  
  UpdateNoteTimekeeping.displayName = "UpdateNoteTimekeeping";
  
  export default UpdateNoteTimekeeping;
  