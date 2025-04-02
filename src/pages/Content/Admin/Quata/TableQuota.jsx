import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Skeleton,
  Table,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetData from "../../../../components/CustomHooks/useGetData";
import formatDateTime from "../../../../utils/dateTime";
// import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import { getListQuata } from "../../../../services/admin/quota/quota";
import EditTableQuota from "./EditTableQuota";
import AddQuota from "./AddQuota";
import ChangeQuota from "./ChangeQuota";
import { debounce } from "lodash";
export default function TableQuota() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listQuota, isLoadListQuota } = useSelector((state) => state.quota);
  const [data, setData] = useState([]);
  const { currentPage, pageSize, handleSizeChange, handlePageChange } =
    useGetData(getListQuata);

  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();
  const [filters, setFilters] = useState("");

  useEffect(() => {
    const dataNew = listQuota?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        company: items?.company?.name,
        user_name: items?.user_name,
        qty_quota_granted: items?.qty_quota_granted,
        before_quota: items?.before_quota,
        after_quota: items?.after_quota,
        issuance_date: items?.issuance_date,
        ip: items?.ip,
        user_agent: items?.user_agent,
        notes: items?.notes,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listQuota]);
  const columns = [
    {
      title: "Mã công ty",
      dataIndex: "company_id",
      editable: true,
      width: "6%",
    },
    {
      title: "Tên công ty",
      dataIndex: "company",
      editable: true,
      width: "11%",
    },
    {
      title: "Tài khoản cấp",
      dataIndex: "user_name",
      editable: true,
      width: "11%",
    },
    {
      title: "Số quota",
      dataIndex: "qty_quota_granted",
      align: "center",
      editable: true,
      width: "11%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Số quota trước giao dịch",
      dataIndex: "before_quota",
      align: "center",
      editable: true,
      width: "11%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Số quota sau giao dịch",
      dataIndex: "after_quota",
      align: "center",
      editable: true,
      width: "11%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ip",
      align: "center",
      editable: true,
      width: "11%",
    },
    {
      title: "Tên máy",
      dataIndex: "user_agent",
      align: "center",
      editable: true,
      width: "11%",
    },
    {
      title: "Nội dung",
      dataIndex: "notes",
      align: "center",
      editable: true,
      width: "11%",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "issuance_date",
      align: "center",
      width: "11%",
      editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    // {
    //   title: "Thao tác",
    //   dataIndex: "operation",
    //   align: "center",
    //   width: "11%",
    //   render: (_, record) => {
    //     return (
    //       <Flex align="center" justify="center" gap={10}>
    //         <EditTableQuota
    //           record={record}
    //           currentPage={currentPage}
    //           pageSize={pageSize}
    //           ref={showEdit}
    //         />
    //         {/* <Tooltip placement="leftTop" title="Xóa">
    //           <Popconfirm
    //             placement="leftTop"
    //             title="Bạn có chắc chắn?"
    //             // onConfirm={() => handleDelete(record.id)}
    //             okText="Xóa"
    //             cancelText="Hủy"
    //           >
    //             <DeleteOutlined style={{ color: "#f5222d", fontSize: 20 }} />
    //           </Popconfirm>
    //         </Tooltip> */}
    //       </Flex>
    //     );
    //   },
    // },
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
  const debouncedSearch = useCallback(
    debounce(async (value) => {
      console.log('value search', value);

      if (value === "") {
        // Khi inputValue bị xóa, chỉ fetch với status
        await dispatch(
          getListQuata({ currentPage, pageSize, value: value, branch_id: filters })
        );
      } else {
        await dispatch(
          getListQuata({
            currentPage,
            pageSize,
            value: value,
            branch_id: filters,
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
      <h2>Quản lý Quota</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Quota",
          },
          {
            title: "Quản lý quota",
            href: "/quota",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddQuota currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl lg md sm>
          <ChangeQuota currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl lg md sm>
          <Input
            style={{ width: 300 }}
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên "
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
            total: listQuota?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadListQuota : false}
          dataSource={isLoadListQuota ? [] : data}
          locale={{
            emptyText: isLoadListQuota ? (
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
