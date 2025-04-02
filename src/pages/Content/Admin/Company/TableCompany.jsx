import { DeleteOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCompany,
  getListCompany,
} from "../../../../services/admin/company/company";
import useGetData from "../../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import AddCompany from "./AddCompany";
import EditCompany from "./EditCompany";
import { debounce } from "lodash";

export default function TableCompany() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listCompany, isLoadCompany } = useSelector((state) => state.company);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();
  const [filters, setFilters] = useState("");
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListCompany);
  const { handleDelete } = useDeleteHandler(
    deleteCompany,
    getListCompany,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  useEffect(() => {
    const dataNew = listCompany?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        name: items?.name,
        address: items?.address,
        phone: items?.phone,
        secret_key: items?.secret_key,
        quota_provider: items?.quota_provider,
        quota_remain: items?.quota_remain,
        manager_name: items?.manager_name,
        software_package: items?.software_package,
        name_e: items?.name_e,
        maintain_message_amount: items?.maintain_message_amount,
        branch_name: items?.branch_name,
        user_zns: items?.user_zns,
        pass_zns: items?.pass_zns,
        template_zns_maintain_schedule_reminder:
          items?.template_zns_maintain_schedule_reminder,
        teamplate_zns_thank_maintain_schedule:
          items?.teamplate_zns_thank_maintain_schedule,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listCompany]);
  const columns = [
    {
      title: "Mã công ty",
      dataIndex: "id",
      editable: true,
      width: "9%",
    },
    {
      title: "Tên công ty",
      dataIndex: "name",
      editable: true,
      width: "9%",
      render: (name, record) => {
        return (
          <div
            onClick={() => handleShowEdit(record)}
            style={{ color: "#1677ff" }}
          >
            {name}
          </div>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
      editable: true,
      width: "9%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
      editable: true,
      width: "9%",
    },
    {
      title: "Tin nhắn đã cấp",
      dataIndex: "quota_provider",
      align: "center",
      editable: true,
      width: "9%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Tin nhắn còn lại",
      dataIndex: "quota_remain",
      align: "center",
      editable: true,
      width: "9%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Số tiền nhắn tin bảo dưỡng",
      dataIndex: "maintain_message_amount",
      align: "center",
      editable: true,
      width: "9%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Gói phần mềm",
      dataIndex: "software_package",
      align: "center",
      editable: true,
      width: "9%",
      render: (record) =>
        record === "Nhan tin"
          ? "Nhắn tin"
          : record === "Bao duong"
            ? "Xưởng sửa chữa"
            : "Đầy đủ",
    },
    {
      title: "Người quản lý",
      dataIndex: "manager_name",
      align: "center",
      editable: true,
      width: "9%",
    },
    {
      title: "OA Zns",
      dataIndex: "oa_zns",
      align: "center",
      editable: true,
      width: "9%",
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      width: "9%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditCompany
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
            />
            <Tooltip placement="leftTop" title="Xóa">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteOutlined style={{ color: "#f5222d", fontSize: 20 }} />
              </Popconfirm>
            </Tooltip>
          </Flex>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable || col.dataIndex === "operation") {
      return col;
    }
    return {
      ...col,
      render: (_, record) => (
        <div
          style={{ cursor: "pointer" }}
        // onClick={() => handleShowEdit(record)}
        >
          {col.render ? col.render(_, record) : record[col.dataIndex]}
        </div>
      ),
    };
  });

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      console.log('value search', value);

      if (value === "") {
        // Khi inputValue bị xóa, chỉ fetch với status
        await dispatch(
          getListCompany({ currentPage, pageSize, value: value, company_id: filters })
        );
      } else {
        await dispatch(
          getListCompany({
            currentPage,
            pageSize,
            value: value,
            company_id: filters,
          })
        );
      }
    }, 1000), // Thời gian debounce, ví dụ 300ms
    [dispatch, currentPage, pageSize, filters]
  );
  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );
  return (
    <div>
      <h2>Quản lý công ty</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Thương hiệu",
          },
          {
            title: "Quản lý công ty",
            href: "/branch-name",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddCompany currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl lg md sm>
          <Input
            style={{ width: 300 }}
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          />
        </Col>
      </Row>
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listCompany?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadCompany : false}
          dataSource={isLoadCompany ? [] : data}
          locale={{
            emptyText: isLoadCompany ? (
              <Flex vertical gap={20}>
                {[...Array(data?.length || 0)].map((_, rowIndex) => (
                  <Flex gap={10} justify="space-between" key={rowIndex}>
                    {columns.map((column) => (
                      <Skeleton.Input
                        key={`${column.dataIndex}-${rowIndex}`}
                        active={true}
                        size="small"
                        style={{ width: "90%" }}
                      />
                    ))}
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Empty />
            ),
          }}
          bordered
          scroll={{ x: 1000, y: 580 }}
        />
      </Form>
    </div>
  );
}
