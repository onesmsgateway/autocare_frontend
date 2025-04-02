import { forwardRef, useEffect } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Tooltip,
} from "antd";
import { useDispatch } from "react-redux";
import useEditHandler from "../../../components/CustomHooks/useEditHandler";
import {
  editWareHouse,
  getListWareHouse,
} from "../../../services/warehouse/warehouse";
const EditWareHouse = forwardRef(function EditWareHouse(props, ref) {
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
    editWareHouse,
    getListWareHouse,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
  useEffect(() => {
    form.setFieldsValue({
      content: updateRecord?.content,
      name: updateRecord?.name,
      store_id: updateRecord?.store_id,
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
        title="Sửa kho"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editWareHouse"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          {/* <Form.Item
            label="Cửa hàng"
            name="store_id"
            rules={[
              {
                required: false,
                message: "Vui lòng chọn khách hàng",
              },
            ]}
          >
            <Select
              allowClear
              virtual
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase()) ||
                option?.value?.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                optionA?.label
                  ?.toLowerCase()
                  .localeCompare(optionB?.label?.toLowerCase())
              }
              // onSearch={(value) => {
              //   if (value.match(/^0[0-9]{9}$/)) {
              //     handleSearch(value);
              //   }
              // }}
              onClear={() => {
                store.dispatch(
                  getListWareHouse({
                    currentPage: 1,
                    pageSize: pageSizeScroll,
                    value: null,
                  })
                );
              }}
              loading={isLoadStores}
              placeholder="Vui lòng chọn khách hàng"
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
          </Form.Item> */}
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên kho ",
                  },
                ]}
                name="name"
                label="Tên kho"
              >
                <Input placeholder="Tên kho" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Ghi chú"
                name="content"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập ghi chú",
                  },
                ]}
              >
                <Input placeholder="Ghi chú" />
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

EditWareHouse.displayName = "EditWareHouse";

export default EditWareHouse;
