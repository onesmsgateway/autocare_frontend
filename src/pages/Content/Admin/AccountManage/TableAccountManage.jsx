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
import { useDispatch, useSelector } from "react-redux";
import formatDateTime from "../../../../utils/dateTime";
import { store } from "../../../../redux/configStores";
// import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import AddAccount from "./AddAccountManage";
import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import EditAccount from "./EditAccountManage";
import { getAllListCompanyBranch } from "../../../../services/admin/companyBranch/companyBranch";
import {
  deleteAccountManage,
  getListAccountManage,
} from "../../../../services/admin/accountManage/accountManage";
// const { Option } = Select;
export default function TableAcountManage() {
  const showEdit = useRef(null);
  const dispatch = useDispatch();
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { isLoadAccountManage, listAccountManage } = useSelector(
    (state) => state.accountManage
  );

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const { loadingScroll, handlePopupScroll, pageSizeScroll } =
  //   usePaginationSelect(getListCompany);

  const { handleDelete } = useDeleteHandler(
    deleteAccountManage,
    getListAccountManage,
    currentPage,
    pageSize,
    data,
    setCurrentPage,
    false,
    getAllListCompanyBranch
  );

  const columns = [
    {
      title: "Tên công ty",
      dataIndex: "company",
      editable: true,
      width: "14%",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      align: "center",
      editable: true,
      width: "14%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
      editable: true,
      width: "14%",
    },
    {
      title: "Zalo ID",
      dataIndex: "zalo_id",
      align: "center",
      editable: true,
      width: "14%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "14%",
      editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      width: "14%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditAccount
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
          onClick={() => handleShowEdit(record)}
        >
          {col.render ? col.render(_, record) : record[col.dataIndex]}
        </div>
      ),
    };
  });

  useEffect(() => {
    store.dispatch(getAllListCompanyBranch());
  }, []);

  useEffect(() => {
    const dataNew = listAccountManage?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        company: items?.company?.name,
        username: items?.username,
        phone: items?.phone,
        zalo_id: items?.zalo_id,
        created_at: items?.created_at,
      };
    });
    setData(dataNew);
  }, [listAccountManage]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getListAccountManage({
          currentPage,
          pageSize,
        })
      );
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);

  return (
    <div>
      <h2>Quản lý tài khoản</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Tài khoản",
          },
          {
            title: "Quản lí tài khoản",
            href: "/account",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddAccount currentPage={currentPage} pageSize={pageSize} />
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
            total: listAccountManage?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadAccountManage : false}
          dataSource={isLoadAccountManage ? [] : data}
          locale={{
            emptyText: isLoadAccountManage ? (
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
          scroll={{ x: 1000, y: 520 }}
        />
      </Form>
    </div>
  );
}
