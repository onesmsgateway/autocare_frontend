import { forwardRef, useEffect } from "react";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Modal, Tooltip, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useEditHandler from "../../../../components/CustomHooks/useEditHandler";
import {
  editBranchName,
  getListBranchName,
} from "../../../../services/admin/branchname/branchname";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import {
  getAllListCompany,
  getListCompany,
} from "../../../../services/admin/company/company";
import { store } from "../../../../redux/configStores";
const { Option } = Select;
const EditBranchName = forwardRef(function EditBranchName(props, ref) {
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
    editBranchName,
    getListBranchName,
    dispatch,
    ref,
    currentPage,
    pageSize
  );
  useEffect(() => {
    form.setFieldsValue({
      company_id: updateRecord?.company_id,
      trademark: updateRecord?.trademark,
    });
  }, [updateRecord, form, isModalOpenEdit]);
  useEffect(() => {
    store.dispatch(getAllListCompany());
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
        title="Sửa thương hiệu"
        open={isModalOpenEdit}
        footer={null}
        // width={650}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editBranchName"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Form.Item
            label="Tên thương hiệu"
            name="trademark"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên thương hiệu",
              },
            ]}
          >
            <Input placeholder="Tên thương hiệu" />
          </Form.Item>
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
                option?.children?.toLowerCase().includes(input.toLowerCase())
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

EditBranchName.displayName = "EditBranchName";

export default EditBranchName;
