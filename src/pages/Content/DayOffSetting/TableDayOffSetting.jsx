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
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setHasFetchData } from "../../../redux/hasFetchData/hasFetchData";
import { debounce } from "lodash";
import { store } from "../../../redux/configStores";
import {
  deleteDayOff,
  getListDayOffSetting,
  getListAllEmployee,
  getListLeaveTypeSetting,
} from "../../../services/timekeeping/timekeeping";
import EditDayOff from "./EditDayOff";
import AddDayOff from "./AddDayOff";
import { settings } from "../../../utils/config";

export default function TableDayOffSetting() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    listDayOffSetting,
    isListDayOffSetting,
    listLeaveTypeSetting,
    isLoadListLeaveTypeSetting,
    listAllEmployee,
    isLoadListAllEmployee,
  } = useSelector((state) => state.timekeeping);
  const { userData } = useSelector((state) => state.user);
  const optionsListEmployee = listAllEmployee?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const optionsLeaveTypeSetting = listLeaveTypeSetting?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const company_id =
    userData?.data?.company_id || settings?.getCookie("company_id");

  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const delayedAction = useRef(
    debounce((value) => {
      store.dispatch(
        getListDayOffSetting({
          currentPage,
          pageSize,
          company_id,
          search: value,
        })
      );
    }, 600)
  ).current;

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      delayedAction(value);
    },
    [delayedAction]
  );

  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  useEffect(() => {
    const callApi = async () => {
      dispatch(setHasFetchData(true));
      await Promise.all[
        (dispatch(getListAllEmployee()),
        dispatch(getListLeaveTypeSetting({ company_id })))
      ];
    };
    callApi();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getListDayOffSetting({ currentPage, pageSize, company_id })
      );
    };
    fetchData();
  }, [currentPage, pageSize, dispatch]);
  useEffect(() => {
    const dataNew = listDayOffSetting?.data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        employee_id: item.employee_id,
        name: item.name,
        leave_type_id: item.leave_type_id,
        leave_type_name: item.leave_type_name,
        leave_stock: item.leave_stock,
      };
    });
    setData(dataNew);
  }, [listDayOffSetting]);
  const handleDelete = async (record) => {
    try {
      const response = await dispatch(deleteDayOff(record.id));
      if (deleteDayOff.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await dispatch(
          getListDayOffSetting({
            currentPage,
            pageSize,
            company_id,
            search: inputValue,
          })
        );
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteDayOff.rejected.match(response)) {
        if (response.payload.error) {
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "employee_id",
      // editable: true,
      width: "11%",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      // editable: true,
      width: "11%",
    },
    {
      title: "Tên loại nghỉ",
      dataIndex: "leave_type_name",
      align: "center",
      // editable: true,
      width: "11%",
    },
    {
      title: "Số ngày còn lại",
      dataIndex: "leave_stock",
      align: "center",
      width: "11%",
      // editable: true,
      // render: (record) => {
      //   const time = formatDateTime(record);
      //   return time;
      // },
    },
    {
      title: "Sửa/Xóa",
      dataIndex: "operation",
      align: "center",
      width: "11%",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <EditDayOff
              record={record}
              currentPage={currentPage}
              pageSize={pageSize}
              ref={showEdit}
              company_id={company_id}
              search={inputValue}
              optionsLeaveTypeSetting={optionsLeaveTypeSetting}
              isLoadListLeaveTypeSetting={isLoadListLeaveTypeSetting}
              optionsListEmployee={optionsListEmployee}
              isLoadListAllEmployee={isLoadListAllEmployee}
            />
            <Tooltip placement="top" title="Xóa">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record)}
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
      <h2>Danh sách số ngày nghỉ việc</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Chấm công",
          },
          {
            title: "Cài đặt số ngày nghỉ việc",
            href: "/leave-types-setting",
          },
        ]}
      />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <AddDayOff
            currentPage={currentPage}
            pageSize={pageSize}
            company_id={company_id}
            search={inputValue}
            optionsLeaveTypeSetting={optionsLeaveTypeSetting}
            isLoadListLeaveTypeSetting={isLoadListLeaveTypeSetting}
            optionsListEmployee={optionsListEmployee}
            isLoadListAllEmployee={isLoadListAllEmployee}
          />
        </Col>
        <Col xl lg md sm>
          <Input
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
            total: listDayOffSetting?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isListDayOffSetting : false}
          dataSource={isListDayOffSetting ? [] : data}
          locale={{
            emptyText: isListDayOffSetting ? (
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
