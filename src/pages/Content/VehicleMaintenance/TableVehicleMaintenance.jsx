import { CheckOutlined, CloseOutlined, FileExcelOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Popconfirm,
  Popover,
  Row,
  Select,
  // Select,
  Skeleton,
  Table,
  Tabs,
  Tooltip,
  message,
} from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import formatDateTime from "../../../utils/dateTime";
import useGetDataMaintenance from "../../../components/CustomHooks/useGetDataMaintenance";
// import useDeleteHandler from "../../../components/CustomHooks/useDeleteHandler";
import { useDispatch, useSelector } from "react-redux";
import EditVehicleMaintenance from "./EditVehicleMaintenance";
import {
  // deleteVehicleMaintenance,
  editVehicleMaintenance,
  getListEmployeMaintain,
  getListVehicleMaintenance,
} from "../../../services/vehicleMaintenance/vehicleMaintenance";
import { getAllListAccessarys } from "../../../services/accessarys/accessarys";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllListJobCateGory } from "../../../services/jobCateGory/jobCateGory";
import AssignWorkEmployees from "./AssignWorkEmployees";
import { setFilters } from "../../../redux/hasFetchData/hasFetchData";
import { settings } from "../../../utils/config";
import axios from "axios";
import { store } from "../../../redux/configStores";

export default function TableVehicleMaintenance() {
  const showEdit = useRef(null);
  const handleShowEdit = (record) => {
    showEdit.current.showModalEdit(record);
  };
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { listVehicleMaintenance, isLoadVehicleMaintenance } = useSelector(
    (state) => state.vehicleMaintenance
  );
  const { listStaffCheckActive, isLoadListStaffCheckActive } = useSelector(
    (state) => state.staff
  );
  const optionStaff = listStaffCheckActive?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });


  const { allListJobCateGory, isLoadAllJobsCategory } = useSelector(
    (state) => state.jobCategory
  );

  console.log('ff', allListJobCateGory);

  const optionJobCategory = allListJobCateGory?.data?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  const optionSelectJobCategory = allListJobCateGory?.data?.map((item) => ({
    label: item?.name, // Gán `name` từ API làm nhãn
    value: item?.id,   // Gán `id` từ API làm giá trị
  }));


  const navigate = useNavigate();
  const [data, setData] = useState();
  const { filters } = useSelector((state) => state.hasFetchData);
  // const [filters, setFilters] = useState("ChoBaoDuong");
  const [inputValue, setInputValue] = useState("");
  const [selectedTypeJob, setSelectedTypeJob] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  console.log('selectTJ: ', selectedTypeJob);
  console.log('selectJ: ', selectedJob);

  const {
    currentPage,
    pageSize,
    handleSizeChange,
    handlePageChange,
    // setCurrentPage,
  } = useGetDataMaintenance(getListVehicleMaintenance, filters, selectedTypeJob, selectedJob);
  // const { handleDelete } = useDeleteHandler(
  //   deleteVehicleMaintenance,
  //   getListVehicleMaintenance,
  //   currentPage,
  //   pageSize,
  //   data,
  //   setCurrentPage,
  //   filters
  // );

  const typeJobLabels = [
    { value: "BaoDuong", label: "Bảo Dưỡng" },
    { value: "SuaChua", label: "Sửa Chữa" },
  ];

  const delayedAction = useRef(
    debounce((typeJob, jobId) => {
      store.dispatch(
        getListVehicleMaintenance({
          currentPage,
          pageSize,
          status: filters,
          search: '',
          type_job: typeJob,
          job_id: jobId,
        })
      );
    }, 600)
  ).current;

  const handleTypeJobChange = useCallback(
    (typeJob) => {
      setSelectedTypeJob(typeJob); // Cập nhật state
      delayedAction(typeJob, selectedJob); // Gọi debounce với giá trị hiện tại của jobId
    },
    [delayedAction, selectedJob] // Chỉ phụ thuộc vào delayedAction và selectedJob
  );

  const handleJobChange = useCallback(
    (jobId) => {
      setSelectedJob(jobId); // Cập nhật state
      delayedAction(selectedTypeJob, jobId); // Gọi debounce với giá trị hiện tại của typeJob
    },
    [delayedAction, selectedTypeJob] // Chỉ phụ thuộc vào delayedAction và selectedTypeJob
  );


  const handleExportExcel = async () => {

    const baseUrl = import.meta.env.VITE_API_URL;
    const exportUrl = `${baseUrl}/company/api/v1/maintenance-export`;
    const hasAccessToken = settings?.getCookie("access_token");
    try {
      console.log('aaa', exportUrl);
      const response = await axios.get(exportUrl, {
        responseType: "blob", // Quan trọng để xử lý file
        headers: {
          Authorization: `Bearer ${hasAccessToken}`, // Nếu cần token
        },
      });
      console.log(response);
      // Tạo URL blob từ phản hồi
      const url = window.URL.createObjectURL(new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BaoDuong.xlsx"); // Tên file tải xuống
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getAllListAccessarys()),
          dispatch(getListEmployeMaintain()),
          dispatch(getAllListJobCateGory()),
        ]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [dispatch]);
  console.log("listVehicleMaintenance", listVehicleMaintenance);

  useEffect(() => {
    const dataNew = listVehicleMaintenance?.data.map((items) => {
      return {
        key: items.id,
        id: items.id,
        customer_id: items?.customer_id,
        customer: items?.customer,
        accessary: items?.accessary,
        type: items?.type,
        name_bike: items?.motor?.name_bike,
        license_plate: items?.motor?.license_plate,
        frame_number: items?.motor?.frame_number,
        machine_number: items?.motor?.machine_number,
        day_in: items?.day_in,
        status: items?.status,
        day_out: items?.day_out,
        maintenance_time: items?.maintenance_time,
        km_number: items?.km_number,
        maintenance_type: items?.maintenance_type,
        company_id: items?.company_id,
        motor_id: items?.motor_id,
        motor: items?.motor,
        motor_status: items?.motor_status,
        type_job: items?.type_job,
        maintenance_accessary: items?.maintenance_accessary,
        discount: items?.discount,
        percentage_discount: items?.percentage_discount,
        vat: items?.vat,
        deposit: items?.deposit,
        created_at: items.created_at,
        created_by: items?.created_by,
        creator: items?.creator,
      };
    });
    setData(dataNew);
  }, [listVehicleMaintenance]);
  const handleUpdateStatus = async (record, status_update = true) => {

    let newStatus;
    if (record.status === "ChoBaoDuong") {
      if (status_update === false) {
        newStatus = "DaHuy";
      } else {
        newStatus = "DangBaoDuong";
      }

    } else if (record.status === "DangBaoDuong") {
      newStatus = "DaBaoDuong";
    } else {
      message.warning("Trạng thái hiện tại không thể cập nhật.");
      return;
    }
    const data = {
      id: record.id,
      accessary_ids: [],
      customer_id: record.customer_id,
      motor_id: record.motor_id,
      type_job: record.type_job,
      day_in: record.day_in,
      maintenance_time: record.maintenance_time,
      km_number: record.km_number,
      motor_status: record.motor_status,
      status: newStatus,
      type: record.type,
      deposit: record.deposit,
    };
    try {
      const response = await dispatch(editVehicleMaintenance(data));

      if (editVehicleMaintenance.fulfilled.match(response)) {
        message.success("Xác nhận thành công");
        await dispatch(
          getListVehicleMaintenance({ currentPage, pageSize, status: filters, type_job: selectedTypeJob, job_id: selectedJob })
        );
      } else if (editVehicleMaintenance.rejected.match(response)) {
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      console.log("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "full_name",
      width: "9%",
      align: "center",
      render: (_, record) => {
        const checkGender =
          record.customer?.gender === "MALE"
            ? "Nam"
            : record.customer?.gender === "FEMALE"
              ? "Nữ"
              : record.customer?.gender === "OTHER"
                ? "Khác"
                : "";
        const title = (
          <>
            <p>Ngày sinh : {record.customer?.birth_day}</p>
            <p>Số điện thoại : {record.customer?.phone}</p>
            <p>Giới tính : {checkGender}</p>
          </>
        );
        return (
          <Popover
            className="config-hover"
            placement="top"
            title={"Thông tin khách hàng"}
            content={title}
          >
            {record.customer?.full_name}
          </Popover>
        );
      },
    },
    {
      title: "Tên xe",
      dataIndex: "name_bike",
      width: "8.3%",
      render: (text, record) => (
        <Tooltip title="Chi tiết bảo dưỡng xe">
          <NavLink to={`/detail-vehicle-maintenance/${record.id}`}>
            {text}
          </NavLink>
        </Tooltip>
      ),
    },
    {
      title: "Biển số",
      dataIndex: "license_plate",
      align: "center",
      // editable: true,
      width: "8.3%",
    },
    {
      title: "Số khung",
      dataIndex: "frame_number",
      align: "center",
      // editable: true,
      width: "8.3%",
      // render: (record) => record.toLocaleString(),
    },
    {
      title: "Số máy móc",
      dataIndex: "machine_number",
      align: "center",
      // editable: true,
      width: "8.3%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      // editable: true,
      width: "8.3%",
      render: (record) => {
        let status, text;

        switch (record) {
          case "ChoBaoDuong":
            status = "warning";
            text = "Chờ xử lý";
            break;
          case "DangBaoDuong":
            status = "processing";
            text = "Đang xử lý";
            break;
          case "DaBaoDuong":
            status = "processing";
            text = "Đã xử lý";
            break;
          case "DaHuy":
            status = "error";
            text = "Đã hủy";
            break;
          default:
            status = "success";
            text = "Đã thanh toán";
        }

        return <Badge status={status} text={text} />;
      }
    },
    {
      title: "Ngày vào",
      dataIndex: "day_in",
      align: "center",
      // editable: true,
      width: "8.3%",
    },
    {
      title: "Lần bảo dưỡng",
      dataIndex: "motor",
      align: "center",
      // editable: true,
      width: "8.3%",
      render: (_, record) => {
        const motor = record?.motor;
        return motor.maintain_quantity;
      },
    },
    {
      title: "Loại công việc",
      dataIndex: "type_job",
      align: "center",
      // editable: true,
      width: "8.3%",
    },
    {
      title: "Loại bảo dưỡng",
      dataIndex: "type",
      align: "center",
      // editable: true,
      width: "8.3%",
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      align: "center",
      width: "8.8%",
      // editable: true,
      render: (_, record) => {
        const creator = record?.creator;

        if (!creator) return "N/A";

        const { username, type } = creator;
        const role = type === 'MANAGER' ? 'Quản lý' : type === 'STAFF' ? 'Nhân Viên' : type === 'CUSTOMER' ? 'Khách hàng' : '';

        return `${username} (${role})`;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      align: "center",
      width: "8.3%",
      // editable: true,
      render: (record) => {
        const time = formatDateTime(record);
        return time;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      width: "8.3%",
      // render: (_, record) => {
      //   return (
      //     <Flex align="center" justify="center" gap={10}>
      //       {record.status === "ChoBaoDuong" ? (
      //         <>
      //           <Popconfirm
      //             placement="top"
      //             title="Xác nhận bảo dưỡng?"
      //             onConfirm={() => handleUpdateStatus(record)}
      //             okText="Đồng ý"
      //             cancelText="Hủy"
      //           >
      //             <Tooltip title="Xác nhận bảo dưỡng">
      //               <CheckOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
      //             </Tooltip>
      //           </Popconfirm>
      //           <Popconfirm
      //             placement="top"
      //             title="Hủy bảo dưỡng?"
      //             onConfirm={() => handleUpdateStatus(record, false)}
      //             okText="Đồng ý"
      //             cancelText="Hủy"
      //           >
      //             <Tooltip title="Xác nhận hủy bảo dưỡng">
      //               <CloseOutlined style={{ fontSize: '18px', cursor: 'pointer', color: 'red' }} />
      //             </Tooltip>
      //           </Popconfirm>
      //         </>
      //       ) : (
      //         <>
      //           {record.status !== "DaThanhToan" && record.status !== "DaBaoDuong" && (
      //             <>
      //               {" "}
      //               <EditVehicleMaintenance
      //                 record={record}
      //                 currentPage={currentPage}
      //                 pageSize={pageSize}
      //                 ref={showEdit}
      //                 filters={filters}
      //               />
      //             </>
      //           )}
      //           {record.status !== "DangBaoDuong" && (
      //             <Tooltip title="Chi tiết bảo dưỡng xe">
      //               <NavLink to={`/detail-vehicle-maintenance/${record.id}`}>
      //                 Chi tiết
      //               </NavLink>
      //             </Tooltip>
      //           )}
      //           {record.status !== "DaThanhToan" && record.status !== "DaBaoDuong" && (
      //             <AssignWorkEmployees
      //               record={record}
      //               currentPage={currentPage}
      //               pageSize={pageSize}
      //               optionStaff={optionStaff}
      //               isLoadListStaffCheckActive={isLoadListStaffCheckActive}
      //               optionJobCategory={optionJobCategory}
      //               isLoadAllJobsCategory={isLoadAllJobsCategory}
      //             />
      //           )}
      //           {record.status === "DangBaoDuong" && (
      //             <Popconfirm
      //               placement="top"
      //               title="Xác nhận đã bảo dưỡng?"
      //               onConfirm={() => handleUpdateStatus(record)}
      //               okText="Đồng ý"
      //               cancelText="Hủy"
      //             >
      //               <Tooltip title="Xác nhận đã bảo dưỡng">
      //                 <CheckOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
      //               </Tooltip>
      //             </Popconfirm>
      //           )}
      //           {record.status === 'DaHuy'}
      //         </>
      //       )}
      //     </Flex>
      //   );
      // },

      render: (_, record) => {
        const isPending = record.status === "ChoBaoDuong";
        const isInProgress = record.status === "DangBaoDuong";
        const isCompleted = record.status === "DaBaoDuong";
        const isPaid = record.status === "DaThanhToan";
        const isCancelled = record.status === "DaHuy";

        return (
          <Flex align="center" justify="center" gap={10}>
            {isPending ? (
              <>
                <Popconfirm
                  placement="top"
                  title="Xác nhận bảo dưỡng?"
                  onConfirm={() => handleUpdateStatus(record)}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Tooltip title="Xác nhận bảo dưỡng">
                    <CheckOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
                  </Tooltip>
                </Popconfirm>
                <Popconfirm
                  placement="top"
                  title="Hủy bảo dưỡng?"
                  onConfirm={() => handleUpdateStatus(record, false)}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Tooltip title="Xác nhận hủy bảo dưỡng">
                    <CloseOutlined style={{ fontSize: "18px", cursor: "pointer", color: "red" }} />
                  </Tooltip>
                </Popconfirm>
              </>
            ) : (
              <>
                {isInProgress && (
                  <>
                    <EditVehicleMaintenance
                      record={record}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      ref={showEdit}
                      filters={filters}
                    />
                    <AssignWorkEmployees
                      record={record}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      optionStaff={optionStaff}
                      isLoadListStaffCheckActive={isLoadListStaffCheckActive}
                      optionJobCategory={optionJobCategory}
                      isLoadAllJobsCategory={isLoadAllJobsCategory}
                    />
                    <Popconfirm
                      placement="top"
                      title="Xác nhận đã bảo dưỡng?"
                      onConfirm={() => handleUpdateStatus(record)}
                      okText="Đồng ý"
                      cancelText="Hủy"
                    >
                      <Tooltip title="Xác nhận đã bảo dưỡng">
                        <CheckOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
                      </Tooltip>
                    </Popconfirm>
                  </>
                )}
                {!isInProgress && (
                  <Tooltip title="Chi tiết bảo dưỡng xe">
                    <NavLink to={`/detail-vehicle-maintenance/${record.id}`}>
                      Chi tiết
                    </NavLink>
                  </Tooltip>
                )}
              </>
            )}
          </Flex>
        );
      }
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
      if (value === "") {
        // Khi inputValue bị xóa, chỉ fetch với status
        await dispatch(
          getListVehicleMaintenance({ currentPage, pageSize, status: filters, type_job: selectedTypeJob, job_id: selectedJob })
        );
      } else {
        await dispatch(
          getListVehicleMaintenance({
            currentPage,
            pageSize,
            status: filters,
            search: value,
            type_job: selectedTypeJob,
            job_id: selectedJob
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

  const handleFileStatus = useCallback(
    (value) => {
      dispatch(setFilters(value));
    },
    [dispatch]
  );
  const items = [
    {
      key: "",
      label: "Tất cả",
      disabled: isLoadVehicleMaintenance,
    },
    {
      key: "ChoBaoDuong",
      label: "Chưa xử lý",
      disabled: isLoadVehicleMaintenance,
    },
    {
      key: "DangBaoDuong",
      label: "Đang xử lý",
      disabled: isLoadVehicleMaintenance,
    },
    {
      key: "DaBaoDuong",
      label: "Đã xử lý",
      disabled: isLoadVehicleMaintenance,
    },
    {
      key: "DaThanhToan",
      label: "Đã thanh toán",
      disabled: isLoadVehicleMaintenance,
    },
    {
      key: "DaHuy",
      label: "Đã Hủy",
      disabled: isLoadVehicleMaintenance,
    },
  ];

  return (
    <div>
      <h2>Danh sách xe bảo dưỡng, sửa chữa </h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Bảo dưỡng, sửa chữa",
          },
          {
            title: "Danh sách",
            href: "/vehicle-maintenance",
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <Button
            type="primary"
            onClick={() => navigate(`/addMaintenance`)}
            icon={<PlusCircleOutlined />}
          >
            Thêm mới
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[8, 8]}>
        <Col xl lg md sm>
          <Input
            style={{ width: 430 }}
            allowClear
            onChange={handleInputChange}
            value={inputValue}
            placeholder="Tìm kiếm theo tên khách hàng, biển số hoặc tên xe"
          />
        </Col>
        <Col xl lg md sm>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="typeJob" style={{ whiteSpace: 'nowrap' }}>
              Loại bảo dưỡng:
            </label>
            <Select
              style={{ width: 200 }}
              onChange={handleTypeJobChange}
              value={selectedTypeJob}
            >
              <Option value="">Tất cả</Option>
              {typeJobLabels.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col xl lg md sm>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="job" style={{ whiteSpace: 'nowrap' }}>
              Công việc:
            </label>
            <Select
              style={{ width: 200 }}
              onChange={handleJobChange}
              value={selectedJob}
            >
              <Option value="">Tất cả</Option>
              {optionSelectJobCategory?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col xl={{ span: 3, offset: 21 }} lg={{ span: 3, offset: 21 }} md={{ span: 3, offset: 21 }} sm>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            disabled={data?.length === 0}
            onClick={() => handleExportExcel()}
          >
            Xuất file excel
          </Button>
        </Col>
      </Row>

      <Divider />
      <Tabs activeKey={filters} items={items} onChange={handleFileStatus} />
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listVehicleMaintenance?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 50, 100],
          }}
          loading={data?.length === 0 ? isLoadVehicleMaintenance : false}
          dataSource={isLoadVehicleMaintenance ? [] : data}
          locale={{
            emptyText: isLoadVehicleMaintenance ? (
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
          scroll={{ x: 1200, y: 520 }}
        />
      </Form>
    </div>
  );
}
