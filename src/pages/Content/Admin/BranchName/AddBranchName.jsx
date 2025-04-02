import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Modal, Skeleton } from "antd";
import useAddHandler from "../../../../components/CustomHooks/useAddHandler";
import {
  createBranchName,
  getListBranchName,
} from "../../../../services/admin/branchname/branchname";
import { useSelector } from "react-redux";
import {
  getAllListCompany,
  getListCompany,
} from "../../../../services/admin/company/company";
import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import { store } from "../../../../redux/configStores";
import { useEffect } from "react";
const { Option } = Select;
export default function AddBranchName({ currentPage, pageSize }) {
  const { formAdd, isModalOpen, isLoading, showModal, handleCancel, onFinish } =
    useAddHandler(createBranchName, getListBranchName, currentPage, pageSize);
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
    store.dispatch(getAllListCompany());
  }, []);
  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <Modal
        title="Thêm thương hiệu"
        open={isModalOpen}
        footer={null}
        // width={650}
        onCancel={handleCancel}
      >
        <Form
          name="addBranchName"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formAdd}
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
              loading={isLoading}
              icon={<PlusCircleOutlined />}
            >
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
