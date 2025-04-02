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
  Select,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAccount,
  getListAccount,
} from "../../../../services/admin/account/account";
import formatDateTime from "../../../../utils/dateTime";
import { store } from "../../../../redux/configStores";
// import usePaginationSelect from "../../../../components/CustomHooks/usePaginationSelect";
import {
  getAllListCompany,
  // getListCompany,
} from "../../../../services/admin/company/company";
import AddAccount from "./AddAccount";
import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import EditAccount from "./EditAccount";
// const { Option } = Select;
export default function TableAcount() {
  const showEdit = useRef(null);
  const dispatch = useDispatch();
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { isLoadAccount, listAccount } = useSelector((state) => state.account);
  const { allListCompany, isLoadCompanyComplete } = useSelector(
    (state) => state.company
  );

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [valueSelected, setValueSelected] = useState(null);
  const [valueFilterAccountType, setValueFilterAccountType] = useState(null);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const { loadingScroll, handlePopupScroll, pageSizeScroll } =
  //   usePaginationSelect(getListCompany);
  const options = allListCompany?.data.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });
  const { handleDelete } = useDeleteHandler(
    deleteAccount,
    getListAccount,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  const columns = [
    {
      title: "ID Công ty",
      dataIndex: "company_id",
      editable: true,
      width: "14%",
    },
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
      title: "Loại tài khoản",
      dataIndex: "type",
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
  const handleSearch = (value) => {
    setValueSelected(value);
  };

  const handleFillterAccountType = (value) => {
    setValueFilterAccountType(value);
  };

  useEffect(() => {
    store.dispatch(getAllListCompany());
  }, []);
  useEffect(() => {
    if (allListCompany && allListCompany.data.length > 0) {
      setValueSelected(allListCompany?.data[0].id);
    }
  }, [allListCompany]);

  useEffect(() => {
    const dataNew = listAccount?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        company: items?.company?.name,
        username: items?.username,
        phone: items?.phone,
        type: items?.type,
        zalo_id: items?.zalo_id,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listAccount]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getListAccount({
          currentPage,
          pageSize,
          company_id: valueSelected,
          type: valueFilterAccountType,
        })
      );
    };
    if (valueSelected) {
      fetchData();
    }
  }, [currentPage, pageSize, dispatch, valueSelected, valueFilterAccountType]);

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
      <Select
        style={{ width: 500 }}
        // allowClear
        optionFilterProp="children"
        filterOption={(input, option) => {
          return option?.label?.toLowerCase().includes(input.toLowerCase());
        }}
        showSearch
        options={options}
        value={valueSelected}
        disabled={isLoadCompanyComplete}
        onChange={handleSearch}
        //   onSearch={(value) => {
        //     if (value.match(/^0[0-9]{9}$/)) {
        //       handleSearch(value);
        //     }
        //   }}
        // listHeight={200}
        // onClear={() => {
        //   store.dispatch(
        //     getListCompany({
        //       currentPage: 1,
        //       pageSize: pageSizeScroll,
        //       value: null,
        //     })
        //   );
        // }}
        placeholder="Tìm kiếm theo công ty"
      // onPopupScroll={handlePopupScroll}
      >
        {/* {options?.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))} */}
        {/* {loadingScroll && (
          <Option key="loading">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Option>
        )} */}
      </Select>
      <Select
        style={{ width: 200, margin: "0 0 0 16px" }}
        allowClear
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        options={[
          {
            value: "MANAGER",
            label: "MANAGER",
          },
          {
            value: "STAFF",
            label: "STAFF",
          },
          {
            value: "CUSTOMER",
            label: "CUSTOMER",
          },
        ]}
        value={valueFilterAccountType}
        disabled={isLoadCompanyComplete}
        onChange={handleFillterAccountType}
        //   onSearch={(value) => {
        //     if (value.match(/^0[0-9]{9}$/)) {
        //       handleSearch(value);
        //     }
        //   }}
        // listHeight={200}
        // onClear={() => {
        //   store.dispatch(
        //     getListCompany({
        //       currentPage: 1,
        //       pageSize: pageSizeScroll,
        //       value: null,
        //     })
        //   );
        // }}
        placeholder="Loại tài khoản"
      // onPopupScroll={handlePopupScroll}
      />
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
            total: listAccount?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadAccount : false}
          dataSource={isLoadAccount ? [] : data}
          locale={{
            emptyText: isLoadAccount ? (
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
