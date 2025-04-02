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
import { deleteCompanyZnsTemp, getListCompanyZnsTemp } from "../../../../services/admin/companyZnsTemp/companyZnsTemp";
import useGetData from "../../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../../components/CustomHooks/useDeleteHandler";
import AddCompanyZnsTemp from "./AddCompanyZnsTemp";
import EditCompanyZnsTemp from "./EditCompanyZnsTemp";
import { debounce } from "lodash";

export default function TableCompanyZnsTemp() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listCompanyZnsTemp, isLoadCompanyZnsTemp } = useSelector((state) => state.companyZnsTemp);
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
  } = useGetData(getListCompanyZnsTemp);
  const { handleDelete } = useDeleteHandler(
    deleteCompanyZnsTemp,
    getListCompanyZnsTemp,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );
  console.log('listCompanyZnsTemp', listCompanyZnsTemp);

  useEffect(() => {
    const dataNew = listCompanyZnsTemp?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        company_id: items?.company_id,
        temp_id: items?.temp_id,
        zns_type: items?.zns_type,
        company: items?.company,
      };
    });
    setData(dataNew);
  }, [listCompanyZnsTemp]);
  const columns = [
    {
      title: "Công ty",
      dataIndex: "company",
      editable: true,
      width: "9%",
      render: (company) => company?.name || " ",
    },
    {
      title: "Zns temp id",
      dataIndex: "temp_id",
      editable: true,
      width: "9%",
    },
    {
      title: "Loại zns temp ",
      dataIndex: "zns_type",
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
            <EditCompanyZnsTemp
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
          getListCompanyZnsTemp({ currentPage, pageSize, value: value })
        );
      } else {
        await dispatch(
          getListCompanyZnsTemp({
            currentPage,
            pageSize,
            value: value,
            // company_id: filters,
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
      <h2>Quản lý Zns temp</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Công ty",
          },
          {
            title: "Quản lý zns temp",
            href: "/company-zns-temp",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddCompanyZnsTemp currentPage={currentPage} pageSize={pageSize} />
        </Col>
        <Col xl lg md sm>
          <Input
            style={{ width: 300 }}
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên công ty hoặc temp id"
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
            total: listCompanyZnsTemp?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadCompanyZnsTemp : false}
          dataSource={isLoadCompanyZnsTemp ? [] : data}
          locale={{
            emptyText: isLoadCompanyZnsTemp ? (
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
