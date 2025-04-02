import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { store } from "../../../redux/configStores";
import { getDetailCarManage } from "../../../services/carmanage/carmanage";
import {
  Breadcrumb,
  Col,
  Divider,
  Empty,
  Flex,
  Row,
  Skeleton,
  Table,
  Typography,
} from "antd";

export default function DetailCarManager() {
  const { detailCarManager, isLoadDetailCarManage } = useSelector(
    (state) => state.carmanage
  );
  console.log(detailCarManager);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getDetailCarManage(id));
    };
    fetchData();
  }, [id]);
  const dataHistoryMaintain = detailCarManager?.maintains?.map((item) => {
    return {
      key: item.id,
      day_in: item?.day_in,
      day_out: item?.day_out,
      discount: item?.discount,
      total_money: item?.total_money,
      type: item?.type,
      type_job: item?.type_job,
      percentage_discount: item?.percentage_discount,
    };
  });
  const columns = [
    {
      title: "Ngày vào",
      dataIndex: "day_in",
      editable: true,
      width: "20%",
    },
    {
      title: "Ngày ra",
      dataIndex: "day_out",
      align: "center",
      editable: true,
      width: "20%",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      align: "center",
      editable: true,
      width: "20%",
      render: (record) => record?.toLocaleString(),
    },
    {
      title: "Chiết khấu",
      dataIndex: "percentage_discount",
      align: "center",
      editable: true,
      width: "20%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_money",
      align: "center",
      editable: true,
      width: "10%",
      render: (record) => record?.toLocaleString(),
    },
  ];
  return (
    <>
      <h2>Chi tiết thông tin xe và lịch sử bảo dưỡng</h2>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Quản lý xe",
          },
          {
            title: "Danh sách xe",
            href: "/car-manage",
          },
          {
            title: "Chi tiết thông tin xe",
            href: `/detail-car-manage/${id}`,
          },
        ]}
      />
      <div className="detail-vehicle-maintain">
        <div style={{ padding: 20 }}>
          {isLoadDetailCarManage ? (
            <Skeleton active paragraph={{ rows: 16 }} />
          ) : (
            <>
              <h3>Thông tin khách hàng và xe</h3>
              <Row gutter={[16, 16]}>
                <Col xl={12} lg={12} md={12} sm={6}>
                  <p>
                    Khách hàng:{" "}
                    <Typography.Text>
                      {detailCarManager?.customer?.full_name}
                    </Typography.Text>
                  </p>
                </Col>
                <Col xl={12} lg={12} md={12} sm={6}>
                  <p>
                    Xe:{" "}
                    <Typography.Text>
                      {detailCarManager?.name_bike} /{" "}
                      {detailCarManager?.license_plate}
                    </Typography.Text>
                  </p>
                </Col>
              </Row>
              <Row style={{ marginTop: 40 }} gutter={[16, 16]}>
                <Col xl={12} lg={12} md={12} sm={6}>
                  <p>
                    Số điện thoại:{" "}
                    <Typography.Text>
                      {detailCarManager?.customer?.phone}
                    </Typography.Text>
                  </p>
                </Col>
                <Col xl={12} lg={12} md={12} sm={6}>
                  <p>
                    Số khung:{" "}
                    <Typography.Text>
                      {detailCarManager?.frame_number}
                    </Typography.Text>
                  </p>
                </Col>
              </Row>
              <Row style={{ marginTop: 40 }} gutter={[16, 16]}>
                <Col xl={12} lg={12} md={12} sm={6}>
                  <p>
                    Số bảo hành:{" "}
                    <Typography.Text>
                      {detailCarManager?.warranty_number}
                    </Typography.Text>
                  </p>
                </Col>
                <Col xl={12} lg={12} md={12} sm={6}>
                  <p>
                    Số máy:{" "}
                    <Typography.Text>
                      {detailCarManager?.machine_number}
                    </Typography.Text>
                  </p>
                </Col>
              </Row>
              <Divider />
              <h3>Lịch sử bảo dưỡng</h3>
              {dataHistoryMaintain?.length === 0 ? (
                <Typography.Text>
                  Khách hàng chưa có thông tin bảo dưỡng{" "}
                </Typography.Text>
              ) : (
                <Table
                  columns={columns}
                  pagination={false}
                  loading={
                    dataHistoryMaintain?.length === 0
                      ? isLoadDetailCarManage
                      : false
                  }
                  dataSource={isLoadDetailCarManage ? [] : dataHistoryMaintain}
                  locale={{
                    emptyText: isLoadDetailCarManage ? (
                      <Flex vertical gap={20}>
                        {[...Array(dataHistoryMaintain?.length || 0)].map(
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
                  scroll={{ x: 1000, y: 520 }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
