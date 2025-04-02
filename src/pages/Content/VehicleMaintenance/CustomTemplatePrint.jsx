import { Col, Divider, Empty, Flex, Row, Skeleton, Table } from "antd";
import { useSelector } from "react-redux";

export default function CustomTemplatePrint({
  detailVehicleMaintenance,
  columns,
  dataAccessary,
  isLoadDetailVehicleMaintenance,
  columnsJob,
  dataJob,
}) {
  const { userData } = useSelector((state) => state.user);
  return (
    <div style={{ padding: 40 }}>
      <h3>CỬA HÀNG SỬA CHỮA BẢO DƯỠNG {userData?.data?.company?.name} </h3>
      <p>Địa chỉ : {userData?.data?.company?.address}</p>
      <p>Số điện thoại : {userData?.data?.company?.phone}</p>
      <h1 style={{ textAlign: "center", margin: "15px 0" }}>
        HÓA ĐƠN SỬA CHỮA BẢO DƯỠNG XE
      </h1>
      <h4>THÔNG TIN KHÁCH HÀNG</h4>
      <Row
        style={{ margin: "20px 0" }}
        justify={"space-between"}
        gutter={[16, 16]}
      >
        <Col xl={12} lg={12} md={12} sm={12}>
          <p>
            Họ và tên :{" "}
            <span>{detailVehicleMaintenance?.customer?.full_name}</span>
          </p>
          <p>
            Địa chỉ : <span>{detailVehicleMaintenance?.customer?.address}</span>
          </p>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12}>
          <p>
            Số điện thoại :
            <span>{detailVehicleMaintenance?.customer?.phone}</span>
          </p>
        </Col>
      </Row>
      <Divider />
      <h4>THÔNG TIN XE</h4>
      <Row
        justify={"space-between"}
        style={{ margin: "20px 0" }}
        gutter={[16, 16]}
      >
        <Col xl={12} lg={12} md={12} sm={12}>
          <p>
            Tên xe : <span>{detailVehicleMaintenance?.motor?.name_bike}</span>
          </p>
          <p>
            Số khung :{" "}
            <span>{detailVehicleMaintenance?.motor?.frame_number}</span>
          </p>
        </Col>
        <Col xl={12} lg={12} md={12} sm={12}>
          <p>
            Biển số :
            <span> {detailVehicleMaintenance?.motor?.license_plate}</span>
          </p>
          <p>
            Số máy :
            <span> {detailVehicleMaintenance?.motor?.machine_number}</span>
          </p>
        </Col>
      </Row>
      <Divider />
      <h4>CHI TIẾT MẶT HÀNG, PHỤ TÙNG VÀ DỊCH VỤ</h4>
      <h4 style={{ margin: "20px 0" }}>Phụ tùng</h4>
      <Table
        columns={columns}
        pagination={false}
        loading={
          dataAccessary?.length === 0 ? isLoadDetailVehicleMaintenance : false
        }
        dataSource={isLoadDetailVehicleMaintenance ? [] : dataAccessary}
        locale={{
          emptyText: isLoadDetailVehicleMaintenance ? (
            <Flex vertical gap={20}>
              {[...Array(dataAccessary?.length || 0)].map((_, rowIndex) => (
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
        size="small"
      />
      <Divider />
      {dataJob?.length !== 0 && (
        <>
          <h4 style={{ margin: "20px 0" }}>Nhân công,dịch vụ</h4>
          <Table
            columns={columnsJob}
            pagination={false}
            loading={
              dataJob?.length === 0 ? isLoadDetailVehicleMaintenance : false
            }
            dataSource={isLoadDetailVehicleMaintenance ? [] : dataJob}
            locale={{
              emptyText: isLoadDetailVehicleMaintenance ? (
                <Flex vertical gap={20}>
                  {[...Array(dataJob?.length || 0)].map((_, rowIndex) => (
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
           size="small"
          />
        </>
      )}
      <div style={{ textAlign: "start" }}>
        <h4 style={{ margin: "10px 0" }}>
          Tổng tiền :{" "}
          <span>
            {detailVehicleMaintenance?.total?.toLocaleString("vi-vn")}
          </span>{" "}
          VNĐ
        </h4>
        {detailVehicleMaintenance?.percentage_discount !== 0 && (
          <h5 style={{ margin: "10px 0" }}>
            Chiết khấu :{" "}
            <span>{detailVehicleMaintenance?.percentage_discount}</span> %
          </h5>
        )}
        {detailVehicleMaintenance?.discount !== 0 && (
          <h5 style={{ margin: "10px 0" }}>
            Giảm giá : <span>{detailVehicleMaintenance?.discount?.toLocaleString("vi-vn")}</span> VNĐ
          </h5>
        )}
        <h5 style={{ margin: "10px 0" }}>
          VAT : <span>{detailVehicleMaintenance?.vat}</span> %
        </h5>
        <h3 style={{ margin: "10px 0 40px 0" }}>
          Tổng thành tiền:{" "}
          <span>
            {detailVehicleMaintenance?.total_money?.toLocaleString("vi-vn")}
          </span>{" "}
          VNĐ
        </h3>
      </div>  
      <Row gutter={[16, 16]} justify={"space-between"}>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <h4>Khách hàng</h4>
            <i>(Ký,họ tên)</i>
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          {" "}
          <div>
            <h4>Kỹ thuật</h4>
            <i>(Ký,họ tên)</i>
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          {" "}
          <div>
            <h4>Kế toán</h4>
            <i>(Ký,họ tên)</i>
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <h4>Người lập phiếu</h4>
            <i>(Ký,họ tên)</i>
          </div>
        </Col>
      </Row>
    </div>
  );
}
