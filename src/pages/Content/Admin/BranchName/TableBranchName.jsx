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
import useGetData from "../../../../components/CustomHooks/useGetData";
import {
  deleteBranchName,
  getListBranchName,
} from "../../../../services/admin/branchname/branchname";
import formatDateTime from "../../../../utils/dateTime";
import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import AddBranchName from "./AddBranchName";
import EditBranchName from "./EditBranchName";
import { debounce } from "lodash";
export default function TableBranchName() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listBranchName, isLoadBranchName } = useSelector(
    (state) => state.branchname
  );
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
  } = useGetData(getListBranchName);
  const { handleDelete } = useDeleteHandler(
    deleteBranchName,
    getListBranchName,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  useEffect(() => {
    const dataNew = listBranchName?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        trademark: items?.trademark,
        company_name: items?.company?.name,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listBranchName]);
  const columns = [
    {
      title: "ID Công ty",
      dataIndex: "company_id",
      editable: true,
      width: "14%",
    },
    {
      title: "Tên công ty",
      dataIndex: "company_name",
      editable: true,
      width: "14%",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "trademark",
      align: "center",
      editable: true,
      width: "14%",
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "created_at",
    //   align: "center",
    //   width: "14%",
    //   editable: true,
    //   render: (record) => {
    //     const time = formatDateTime(record);
    //     return time;
    //   },
    // },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      width: "14%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditBranchName
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

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      console.log('value search', value);

      if (value === "") {
        // Khi inputValue bị xóa, chỉ fetch với status
        await dispatch(
          getListBranchName({ currentPage, pageSize, value: value, branch_id: filters })
        );
      } else {
        await dispatch(
          getListBranchName({
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
      <h2>Quản lý thương hiệu</h2>
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
            title: "Quản lý thương hiệu",
            href: "/branch-name",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddBranchName currentPage={currentPage} pageSize={pageSize} />
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
            total: listBranchName?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadBranchName : false}
          dataSource={isLoadBranchName ? [] : data}
          locale={{
            emptyText: isLoadBranchName ? (
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
