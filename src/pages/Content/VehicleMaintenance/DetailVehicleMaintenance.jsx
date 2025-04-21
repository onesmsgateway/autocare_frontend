import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { store } from "../../../redux/configStores";
import {
  getDetailVehicleMaintenance,
  payMent,
  znsInvoiceVehicleMaintenance,
} from "../../../services/vehicleMaintenance/vehicleMaintenance";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Divider,
  Empty,
  Flex,
  Image,
  Modal,
  Row,
  Skeleton,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import { ReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import CustomTemplatePrint from "./CustomTemplatePrint";
import EditVehicleMaintenance from "./EditVehicleMaintenance";
import {
  editVehicleMaintenance,
} from "../../../services/vehicleMaintenance/vehicleMaintenance";

const content = <div />;
export default function DetailVehicleMaintenance() {
  const { detailVehicleMaintenance, isLoadDetailVehicleMaintenance } =
    useSelector((state) => state.vehicleMaintenance);
  const componentRef = useRef();
  const { id } = useParams();
  const isShowButtons = ['DaBaoDuong', 'DaThanhToan'].includes(detailVehicleMaintenance?.status);
  const [isSendingZns, setIsSendingZns] = useState(false);

  const showConfirmSendZns = () => {
    Modal.confirm({
      title: 'Xác nhận gửi hóa đơn ZNS',
      content: 'Bạn có chắc chắn muốn gửi hóa đơn bảo dưỡng qua ZNS?',
      okText: 'Gửi',
      cancelText: 'Hủy',
      onOk: handleSendZnsInvoice
    });
  };

  const handleSendZnsInvoice = async () => {
    setIsSendingZns(true);
    try {
      const data = {
        maintenance_id: detailVehicleMaintenance?.id
      };

      const response = await store.dispatch(znsInvoiceVehicleMaintenance(data));
      console.log('response', response);
      if (response?.payload?.status === 200) {
        message.success('Đã gửi hóa đơn ZNS thành công');
      } else {
        message.warning(response?.payload?.message || 'Gửi hóa đơn không thành công');
      }
    } catch (error) {
      console.error('Error sending ZNS invoice:', error);
      message.error('Có lỗi xảy ra khi gửi hóa đơn');
    } finally {
      setIsSendingZns(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getDetailVehicleMaintenance(id));
    };
    fetchData();
  }, [id]);
  const dataAccessary = detailVehicleMaintenance?.maintenance_accessary?.map(
    (item) => {
      return {
        key: item.id,
        name_accessary: item?.accessary_info?.name_accessary,
        quantity_export: item?.quantity_export,
        unit_price: item?.unit_price,
      };
    }
  );
  const handleAcceptStatus = async (detailVehicleMaintenance) => {
    let newStatus;
    const currentStatus = detailVehicleMaintenance?.status;

    if (currentStatus === "DaBaoDuong") {
      newStatus = "DaThanhToan";
    } else {
      message.warning("Trạng thái hiện tại không thể cập nhật.");
      return;
    }

    const data = {
      id: detailVehicleMaintenance.id,
      customer_id: detailVehicleMaintenance.customer_id,
      motor_id: detailVehicleMaintenance.motor_id,
      type_job: detailVehicleMaintenance.type_job,
      day_in: detailVehicleMaintenance.day_in,
      maintenance_time: detailVehicleMaintenance.maintenance_time,
      km_number: detailVehicleMaintenance.km_number,
      motor_status: detailVehicleMaintenance.motor_status,
      status: newStatus,
      type: detailVehicleMaintenance.type,
    };

    try {
      const response = await store.dispatch(editVehicleMaintenance(data));
      console.log('res', response);
      if (editVehicleMaintenance.fulfilled.match(response)) {
        message.success("Xác nhận thành công");
        await store.dispatch(getDetailVehicleMaintenance(id));
      } else if (editVehicleMaintenance.rejected.match(response)) {
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            response.payload.errors[field].forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      console.log("Có lỗi xảy ra", error);
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "Tên phụ tùng",
      dataIndex: "name_accessary",
      editable: true,
      width: "10%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity_export",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "Đơn giá",
      dataIndex: "unit_price",
      align: "center",
      editable: true,
      width: "10%",
      render: (record) => record?.toLocaleString(),
    },
    {
      title: "Thành tiền",
      dataIndex: "pay_money",
      align: "center",
      editable: true,
      width: "10%",
      render: (_, record) =>
        (record.quantity_export * record.unit_price)?.toLocaleString("vi-vn"),
    },
  ];
  const dataJob = detailVehicleMaintenance?.jobs?.map((item) => {
    return {
      key: item.id,
      job_category: item.job_category?.name,
      employees: item?.employees,
      total_wage: item.total_wage,
      quantity: item?.quantity,
      wage: item?.job_category?.wage,
      notes: item.job_category?.note,
    };
  });
  console.log('recording', dataJob);

  const columnsJob = [
    {
      title: "Tên công việc",
      dataIndex: "job_category",
      editable: true,
      width: "25%",
    },
    {
      title: "Thợ",
      dataIndex: "employees",
      align: "center",
      editable: true,
      width: "25%",
      render: (_, record) =>
        record.employees.map((item) => item?.employee?.name).join(", "),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "Đơn giá",
      dataIndex: "wage",
      align: "center",
      editable: true,
      width: "10%",
      render: (record) => record?.toLocaleString("vi-vn"),
    },
    {
      title: "ghi chú",
      dataIndex: "notes",
      align: "center",
      editable: true,
      width: "20%",
    },
    {
      title: "Thành tiền",
      dataIndex: "total_wage",
      align: "center",
      editable: true,
      width: "25%",
      render: (record) => record?.toLocaleString("vi-vn"),
    },
  ];
  const [loadPayment, setLoadPayMent] = useState();
  const [data, setData] = useState();
  const handlePayment = async () => {
    const data = {
      maintain_id: detailVehicleMaintenance?.id,
      redirectUrl: "https://autocare.conek.vn:1234",
    };
    setLoadPayMent(true);
    try {
      const res = await store.dispatch(payMent(data));
      if (res.payload.code === 200) {
        message.info("Tạo mã QR thành công");
        setData(res?.payload?.data?.data);
        setLoadPayMent(false);
      }
      if (res.payload.code === 400) {
        message.warning(res.payload.message);
        setData(res?.payload?.data);
        setLoadPayMent(false);
      }
    } catch (error) {
      setLoadPayMent(false);
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <div>
      <h2>Chi tiết thông tin bảo dưỡng, sửa chữa</h2>
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
            title: "Danh sách xe bảo dưỡng, sửa chữa",
            href: "/vehicle-maintenance",
          },
          {
            title: "Chi tiết",
            href: `/detail-vehicle-maintenance/${id}`,
          },
        ]}
      />
      {isShowButtons && (
        <>
          <ReactToPrint
            trigger={() => (
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                style={{ margin: "20px 0" }}
              >
                In Phiếu Bảo Dưỡng
              </Button>
            )}
            content={() => componentRef.current}
          />

          <div style={{ position: "absolute", left: "-9999px" }}>
            <div ref={componentRef}>
              <CustomTemplatePrint
                columns={columns}
                dataAccessary={dataAccessary}
                isLoadDetailVehicleMaintenance={isLoadDetailVehicleMaintenance}
                detailVehicleMaintenance={detailVehicleMaintenance}
                columnsJob={columnsJob}
                dataJob={dataJob}
              />
            </div>
          </div>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            style={{ margin: "20px 10px" }}
            onClick={showConfirmSendZns}
            loading={isSendingZns}
            disabled={!detailVehicleMaintenance || isSendingZns}
          >
            Gửi zns hóa đơn bảo dưỡng
          </Button>
        </>
      )}
      <div className="detail-vehicle-maintain">
        <div style={{ padding: 30 }}>
          {isLoadDetailVehicleMaintenance ? (
            <Skeleton active paragraph={{ rows: 16 }} />
          ) : (
            <>
              {!data && (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Khách hàng:{" "}
                        <Typography.Text mark>
                          {detailVehicleMaintenance?.customer?.full_name}
                        </Typography.Text>
                      </p>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Xe:{" "}
                        <Typography.Text mark>
                          {detailVehicleMaintenance?.motor?.name_bike} /{" "}
                          {detailVehicleMaintenance?.motor?.license_plate}
                        </Typography.Text>
                      </p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 40 }} gutter={[16, 16]}>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Loại công việc:{" "}
                        {detailVehicleMaintenance?.type_job === "BaoDuong" ? (
                          <Checkbox.Group
                            options={[
                              {
                                label: "Bảo dưỡng dịch vụ",
                                value: "BaoDuongDichVu",
                              },
                              {
                                label: "Bảo dưỡng định kỳ",
                                value: "BaoDuongDinhKy",
                              },
                            ]}
                            value={detailVehicleMaintenance?.type}
                          />
                        ) : (
                          <Typography.Text mark>Sửa chữa</Typography.Text>
                        )}
                      </p>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Bảo dưỡng lần số:{" "}
                        <Typography.Text mark>
                          {detailVehicleMaintenance?.motor?.maintain_quantity}
                        </Typography.Text>
                      </p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 40 }} gutter={[16, 16]}>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Ngày vào:{" "}
                        <Typography.Text mark>
                          {detailVehicleMaintenance?.day_in}
                        </Typography.Text>
                      </p>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Ngày ra:{" "}
                        <Typography.Text mark>
                          {detailVehicleMaintenance?.day_out === null
                            ? "Không xác định"
                            : detailVehicleMaintenance?.day_out}
                        </Typography.Text>
                      </p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 40 }} gutter={[16, 16]}>
                    <Col xl={12} lg={23} md={12} sm={6}>
                      <p>
                        Tình trạng xe:{" "}
                        <Typography.Text mark>
                          {detailVehicleMaintenance?.motor_status !== null
                            ? detailVehicleMaintenance?.motor_status
                            : "Không xác định"}
                        </Typography.Text>
                      </p>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={6}>
                      <p>
                        Trạng thái:{" "}
                        <Typography.Text mark>
                          {(() => {
                            switch (detailVehicleMaintenance?.status) {
                              case "ChoBaoDuong":
                                return "Chờ bảo dưỡng";
                              case "DangBaoDuong":
                                return "Đang bảo dưỡng";
                              case "DaBaoDuong":
                                return "Đã bảo dưỡng";
                              case "DaThanhToan":
                                return "Đã thanh toán";
                              default:
                                return "Trạng thái không xác định";
                            }
                          })()}
                        </Typography.Text>
                      </p>
                    </Col>
                  </Row>
                  <Divider />
                  {dataAccessary?.length !== 0 && (
                    <>
                      <h4 style={{ margin: "20px 0" }}>Phụ tùng</h4>
                      <Table
                        columns={columns}
                        pagination={false}
                        loading={
                          dataAccessary?.length === 0
                            ? isLoadDetailVehicleMaintenance
                            : false
                        }
                        dataSource={
                          isLoadDetailVehicleMaintenance ? [] : dataAccessary
                        }
                        locale={{
                          emptyText: isLoadDetailVehicleMaintenance ? (
                            <Flex vertical gap={20}>
                              {[...Array(dataAccessary?.length || 0)].map(
                                (_, rowIndex) => (
                                  <Flex
                                    gap={10}
                                    justify="space-between"
                                    key={rowIndex}
                                  >
                                    {columns.map((column) => (
                                      <Skeleton.Input
                                        key={`${column.dataIndex}-${rowIndex}`}
                                        active={true}
                                        size="small"
                                        style={{ width: "90%" }}
                                      />
                                    ))}
                                  </Flex>
                                )
                              )}
                            </Flex>
                          ) : (
                            <Empty />
                          ),
                        }}
                        bordered
                        scroll={{ x: 600 }}
                      />
                    </>
                  )}
                  <Divider />
                  {dataJob?.length !== 0 && (
                    <>
                      <h4 style={{ margin: "20px 0" }}>Nhân công,dịch vụ</h4>
                      <Table
                        columns={columnsJob}
                        pagination={false}
                        loading={
                          dataJob?.length === 0
                            ? isLoadDetailVehicleMaintenance
                            : false
                        }
                        dataSource={
                          isLoadDetailVehicleMaintenance ? [] : dataJob
                        }
                        locale={{
                          emptyText: isLoadDetailVehicleMaintenance ? (
                            <Flex vertical gap={20}>
                              {[...Array(dataJob?.length || 0)].map(
                                (_, rowIndex) => (
                                  <Flex
                                    gap={10}
                                    justify="space-between"
                                    key={rowIndex}
                                  >
                                    {columns.map((column) => (
                                      <Skeleton.Input
                                        key={`${column.dataIndex}-${rowIndex}`}
                                        active={true}
                                        size="small"
                                        style={{ width: "90%" }}
                                      />
                                    ))}
                                  </Flex>
                                )
                              )}
                            </Flex>
                          ) : (
                            <Empty />
                          ),
                        }}
                        bordered
                        scroll={{ x: 600 }}
                      />
                    </>
                  )}
                  <h4 style={{ margin: "20px 0" }}>
                    Tổng tiền :{" "}
                    <span>
                      {detailVehicleMaintenance?.total_money?.toLocaleString(
                        "vi-vn"
                      )}
                    </span>{" "}
                    VNĐ
                  </h4>

                  <h4 style={{ margin: "20px 0" }}>
                    Số tiền trả trước :{" "}
                    <span>
                      {detailVehicleMaintenance?.deposit?.toLocaleString(
                        "vi-vn"
                      )}
                    </span>{" "}
                    VNĐ
                  </h4>
                </>
              )}
              {detailVehicleMaintenance?.status === "DaBaoDuong" &&
                (data ? (
                  <Typography.Title level={3}>
                    Vui lòng quét QR để thanh toán
                  </Typography.Title>
                ) : (
                  <>
                    <Button
                      type="primary"
                      disabled={loadPayment}
                      onClick={handlePayment}
                    >
                      Thanh toán
                    </Button>
                    <Button
                      type="default"
                      style={{ marginLeft: 8 }}
                      // onClick={handleAcceptStatus}
                      onClick={(e) => handleAcceptStatus(detailVehicleMaintenance)}
                    >
                      Thanh toán tiền mặt
                    </Button>
                  </>
                ))}

              {loadPayment ? (
                <Spin tip="Vui lòng chờ..." size="default">
                  {content}
                </Spin>
              ) : (
                data && (
                  <div style={{ margin: "10px 0", textAlign: "center" }}>
                    {data && <Image width={400} src={data?.imageUrl} />}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
