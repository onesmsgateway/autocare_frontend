import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  FormOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../redux/configStores";
import { getDetailJobCateGory } from "../../../services/jobCateGory/jobCateGory";
import {
  createAssignWork,
  deleteAssignWork,
  getListAssignWork,
} from "../../../services/vehicleMaintenance/vehicleMaintenance";
import formatDateTime from "../../../utils/dateTime";
import { render } from "nprogress";

export default function AssignWorkEmployees(props) {
  const {
    record,
    optionJobCategory,
    isLoadAllJobsCategory,
    optionStaff,
    isLoadListStaffCheckActive,
  } = props;
  const { listAssignWork, isLoadAssignWork } = useSelector(
    (state) => state.vehicleMaintenance
  );

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = (current, size) => {
    setPageSize(size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [formWork] = Form.useForm();
  const [isEditLoading, setEditLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onFinish = async (values) => {
    const data = {
      id: record?.id,
      ...values,
      maintenance_id: record?.id,
      job_categories: selectedJob,
    };
    // console.log(data)
    setEditLoading(true);
    try {
      const response = await dispatch(createAssignWork(data));
      if (createAssignWork.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Giao việc thành công");
        await dispatch(
          getListAssignWork({
            currentPage,
            pageSize,
            maintenance_id: record?.id,
          })
        );
        setSelectedJob([]);
        formWork.resetFields();
      } else if (createAssignWork.rejected.match(response)) {
        setEditLoading(false);
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
      setEditLoading(false);
    }
  };
  useEffect(() => {
    if (open && record?.id) {
      const fetchData = async () => {
        await dispatch(
          getListAssignWork({
            currentPage,
            pageSize,
            maintenance_id: record?.id,
          })
        );
      };
      fetchData();
    }
  }, [currentPage, pageSize, dispatch, record?.id, open]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const dataNew = listAssignWork?.map((items, index) => {
      return {
        key: index,
        id: items.id,
        company_id: items?.company_id,
        employee: items?.employee?.name,
        maintenance_id: items?.maintenance_id,
        content: items?.job_category?.name,
        employee_wage: items?.employee_wage,
        quantity: items?.quantity,
        notes: items?.job_category?.notes,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listAssignWork, open]);
  const handleDelete = async (id) => {
    try {
      const response = await store.dispatch(deleteAssignWork(id));
      if (deleteAssignWork.fulfilled.match(response)) {
        message.success("Xóa thành công");
        await store.dispatch(
          getListAssignWork({
            currentPage,
            pageSize,
            maintenance_id: record?.id,
          })
        );
        if (data.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else if (deleteAssignWork.rejected.match(response)) {
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
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "employee",
      editable: true,
      width: "14%",
    },
    {
      title: "Tên công việc",
      dataIndex: "content",
      align: "center",
      editable: true,
      width: "14%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      editable: true,
      width: "14%",
    },
    {
      title: "Đơn giá",
      dataIndex: "employee_wage",
      align: "center",
      editable: true,
      width: "14%",
      render: (record) => record.toLocaleString(),
    },
    {
      title: "Tiền công",
      align: "center",
      editable: true,
      width: "14%",
      render: (record) => {
        return (record.employee_wage * record.quantity).toLocaleString();
      }
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
  const [selectedJob, setSelectedJob] = useState([]);
  const [loadingSelectJob, setLoadingSelectJob] = useState(false);
  const handleSelectJob = async (selectedValues) => {
    try {
      setLoadingSelectJob(true); // Đặt trạng thái loading là true khi bắt đầu gọi API

      const jobDetails = await Promise.all(
        selectedValues.map((idJob) =>
          store.dispatch(getDetailJobCateGory(idJob))
        )
      );
      const newSelectedJob = jobDetails
        .filter((detail) => detail)
        .map((detail) => ({
          job_category_id: detail.payload.data.id,
          employee_wage: detail.payload.data.wage,
          name: detail.payload.data.name,
          quantity: detail.payload.data.quantity || 1,
        }));
      console.log('newSelectedJob', newSelectedJob);

      setSelectedJob(newSelectedJob);
    } catch (error) {
      console.error("Error occurred while fetching accessory details:", error);
    } finally {
      setLoadingSelectJob(false); // Đặt trạng thái loading là false sau khi kết thúc gọi API
    }
  };
  const handlePriceJob = useCallback((index, value) => {
    setSelectedJob((prevState) => {
      const newSelectedJob = [...prevState];
      newSelectedJob[index].employee_wage = value;
      return newSelectedJob;
    });
  }, []);
  const handleQuantityJob = useCallback((index, value) => {
    setSelectedJob((prevState) => {
      const newSelectedJob = [...prevState];
      newSelectedJob[index].quantity = value;
      return newSelectedJob;
    });
  }, []);
  const [disableJob, setDisableJob] = useState(false);
  const handleDisableJob = (value) => {
    setDisableJob(!!value);
  };
  const status =
    record?.status === "ChoBaoDuong" || record?.status === "DaBaoDuong";
  return (
    <div>
      <Tooltip placement="topLeft" title="Giao việc">
        <span
          style={{
            fontSize: 20,
            cursor: status ? "not-allowed" : "pointer", // Thay đổi cursor nếu isDisabled là true
            opacity: status ? 0.5 : 1, // Thay đổi opacity nếu isDisabled là true
          }}
          onClick={() => {
            if (!status) {
              showModal(record);
            }
          }}
        >
          <FormOutlined />
        </span>
      </Tooltip>
      <Modal
        title="Giao việc"
        open={open}
        footer={null}
        width={950}
        onCancel={handleCancel}
      >
        <Form
          name="editJob"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formWork}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={24}>
              {" "}
              {/* Add 'sm={24}' to occupy full width on small screens */}
              <Form.Item
                name="employee_id"
                label="Nhân viên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn nhân viên",
                  },
                ]}
              >
                <Select
                  showSearch
                  virtual
                  // mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  disabled={isLoadListStaffCheckActive}
                  placeholder="Vui lòng chọn nhân viên"
                  options={optionStaff}
                  onChange={handleDisableJob}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                name="job_categories"
                label="Chọn công việc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn công việc",
                  },
                ]}
              >
                <Select
                  options={optionJobCategory}
                  loading={isLoadAllJobsCategory}
                  allowClear
                  showSearch
                  virtual
                  maxTagCount="responsive"
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  filterSort={(optionA, optionB) =>
                    optionA?.label
                      ?.toLowerCase()
                      .localeCompare(optionB?.label?.toLowerCase())
                  }
                  placeholder="Vui lòng chọn công việc"
                  onChange={handleSelectJob}
                  disabled={loadingSelectJob || !disableJob}
                />
              </Form.Item>
            </Col>
          </Row>
          {loadingSelectJob ? (
            <Spin>
              <div className="content" />
            </Spin>
          ) : (
            <>
              <Row align={"middle"}>

                {selectedJob.map((job, index) => (
                  <>
                    <Form.Item
                      key={job.id}
                      style={{ marginRight: 10 }}
                      label={
                        <span>
                          Số lượng /{" "}
                          <span style={{ color: "#52c41a", fontWeight: 600 }}>
                            {job.name}
                          </span>
                        </span>
                      }
                    >
                      <InputNumber
                        value={job.quantity}
                        onChange={(value) => {
                          const quantity = value || 1; // Nếu value là undefined, mặc định là 1
                          handleQuantityJob(index, quantity);
                        }}
                      />
                    </Form.Item>
                  </>
                ))}
              </Row>
              <Row align={"middle"}>

                {selectedJob.map((job, index) => (
                  <>
                    <Form.Item
                      key={job.id}
                      style={{ marginRight: 10 }}
                      label={
                        <span>
                          Tiền công /{" "}
                          <span style={{ color: "#52c41a", fontWeight: 600 }}>
                            {job.name}
                          </span>
                        </span>
                      }
                    >
                      <InputNumber
                        disabled
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        value={job.employee_wage}
                        onChange={(value) => {
                          if (value > 0) handlePriceJob(index, value);
                        }}
                      />
                    </Form.Item>
                  </>
                ))}
              </Row>
            </>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loadingSelectJob || isLoadAssignWork}
              loading={isEditLoading}
              icon={<PlusCircleOutlined />}
            >
              Giao việc
            </Button>
          </Form.Item>
        </Form>
        <Table
          size="small"
          columns={columns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listAssignWork?.total,
            current: currentPage,
            onChange: handlePageChange,
            pageSizeOptions: [10, 20, 30],
          }}
          loading={data?.length === 0 ? isLoadAssignWork : false}
          dataSource={isLoadAssignWork ? [] : data}
          locale={{
            emptyText: isLoadAssignWork ? (
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
          scroll={{ x: 600, y: 520 }}
        />
      </Modal>
    </div>
  );
}
