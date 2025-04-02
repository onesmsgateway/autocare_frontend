import { DeleteOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Popconfirm,
  Row,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useGetData from "../../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import AddCompanyBranch from "./AddCompanyBranch";
import EditCompanyBranch from "./EditCompanyBranch";
import {
  deleteCompanyBranch,
  getListCompanyBranch,
} from "../../../../services/admin/companyBranch/companyBranch";

export default function TableCompany() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listCompanyBranch, isLoadCompanyBranch } = useSelector(
    (state) => state.companyBranch
  );
  const [data, setData] = useState([]);

  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListCompanyBranch);
  const { handleDelete } = useDeleteHandler(
    deleteCompanyBranch,
    getListCompanyBranch,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  useEffect(() => {
    const dataNew = listCompanyBranch?.data.map((items) => {
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
  }, [listCompanyBranch]);
  const columns = [
    {
      title: "Mã chi nhánh",
      dataIndex: "id",
      editable: true,
      width: "9%",
    },
    {
      title: "Tên chi nhánh",
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
    // {
    //   title: "Người lập phiếu",
    //   dataIndex: "manager_name",
    //   align: "center",
    //   editable: true,
    //   width: "9%",
    // },
    {
      title: "Người quản lý",
      dataIndex: "manager_name",
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
            <EditCompanyBranch
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
  return (
    <div>
      <h2>Quản lý chi nhánh</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Chi nhánh",
          },
          {
            title: "Quản lý chi nhánh",
            href: "/branch-name",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddCompanyBranch currentPage={currentPage} pageSize={pageSize} />
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
            total: listCompanyBranch?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadCompanyBranch : false}
          dataSource={isLoadCompanyBranch ? [] : data}
          locale={{
            emptyText: isLoadCompanyBranch ? (
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
