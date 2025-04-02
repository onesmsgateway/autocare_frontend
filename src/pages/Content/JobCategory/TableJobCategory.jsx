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
import formatDateTime from "../../../utils/dateTime";
import useGetData from "../../../components/CustomHooks/useGetData";
import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import { store } from "../../../redux/configStores";
import { getAllListStaff } from "../../../services/staff/staff";
import AddJobCategory from "./AddJobCategory";
import EditJobCategory from "./EditJobCategory";
import {
  deleteJobCateGory,
  getListJobCateGory,
} from "../../../services/jobCateGory/jobCateGory";

export default function TableJobCategory() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const [form] = Form.useForm();
  const { listJobsCateGory, isLoadJobsCategory } = useSelector(
    (state) => state.jobCategory
  );
  useEffect(() => {
    store.dispatch(getAllListStaff());
  }, []);
  const [data, setData] = useState([]);
  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    setCurrentPage,
  } = useGetData(getListJobCateGory);
  const { handleDelete } = useDeleteHandler(
    deleteJobCateGory,
    getListJobCateGory,
    currentPage,
    pageSize,
    data,
    setCurrentPage
  );

  useEffect(() => {
    const dataNew = listJobsCateGory?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        company_id: items?.company_id,
        name: items?.name,
        wage: items?.wage,
        note: items?.note,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listJobsCateGory]);
  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "name",
      align: "center",
      // editable: true,
      width: "14%",
    },
    {
      title: "Tiền công",
      dataIndex: "wage",
      align: "center",
      // editable: true,
      width: "14%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      align: "center",
      // editable: true,
      width: "14%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "14%",
      // editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    {
      title: "Sửa/Xóa",
      dataIndex: "operation",
      align: "center",
      width: "14%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditJobCategory
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
  return (
    <div>
      <h2>Danh mục công việc</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Công việc",
          },
          {
            title: "Danh mục công việc",
            href: "/job-category",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <AddJobCategory currentPage={currentPage} pageSize={pageSize} />
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
            total: listJobsCateGory?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadJobsCategory : false}
          dataSource={isLoadJobsCategory ? [] : data}
          locale={{
            emptyText: isLoadJobsCategory ? (
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
