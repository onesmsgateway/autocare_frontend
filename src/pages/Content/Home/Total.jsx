import { useEffect, useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "dayjs/locale/vi";
import {
  CarOutlined,
  DashboardOutlined,
  DollarOutlined,
  MessageOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Col, Result, Row } from "antd";

export default function Total({ listToTalDashboard, listBarChart }) {
  const [data, setData] = useState();
  const [pieChart, setPiechart] = useState([]);
  useEffect(() => {
    const data = listBarChart?.results?.map((item) => {
      return {
        "Thời gian": listBarChart.type === "day" ? item?.day : item?.month,
        "Doanh thu": item?.total,
      };
    });
    setData(data);
  }, [listBarChart]);
  useEffect(() => {
    const data = listToTalDashboard?.data?.revenue_chart?.map((item) => {
      return {
        name: item?.name,
        value: item.value,
      };
    });

    setPiechart(data);
  }, [listToTalDashboard]);
  const RADIAN = Math.PI / 180;
  const COLORS = ["#4096ff", "#00C49F", "#FFBB28"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + (radius + 25) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius + 25) * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle" // Căn giữa theo trục x
        dominantBaseline="middle" // Căn giữa theo trục y
        fontSize={15}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const allZero = pieChart?.every((item) => item.value === 0);
  return (
    <>
      <Row gutter={[16, 16]} justify={"space-between"}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          {" "}
          <div className="box-total-group">
            <DollarOutlined />
            <div>
              <p>Tổng doanh thu </p>
              <p>
                {listToTalDashboard?.data?.revenue?.toLocaleString()}
                {listToTalDashboard?.data?.revenue ? " VNĐ" : ""}
              </p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-total-group">
            <DashboardOutlined />
            <div>
              <p>Số lượt bảo dưỡng </p>
              <p>{listToTalDashboard?.data?.count_maintenance}</p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-total-group">
            <DashboardOutlined />
            <div>
              <p>Số lượt sửa chữa </p>
              <p>{listToTalDashboard?.data?.count_repair}</p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          {" "}
          <div className="box-total-group">
            <CarOutlined />
            <div>
              <p>Xe đã bán </p>
              <p>{listToTalDashboard?.data?.count_motor_sale}</p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-total-group">
            <ToolOutlined />
            <div>
              <p>Phụ tùng xuất kho</p>
              <p>{listToTalDashboard?.data?.count_PhuTung}</p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-total-group">
            <ToolOutlined />
            <div>
              <p>Vật tư xuất kho </p>
              <p>{listToTalDashboard?.data?.count_VatTu}</p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-total-group">
            <MessageOutlined />
            <div>
              <p>Tin nhắn </p>
              <p>{listToTalDashboard?.data?.count_sms}</p>
            </div>
          </div>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <div className="box-total-group">
            <UsergroupAddOutlined />
            <div>
              <p>Số lượt khách </p>
              <p>{listToTalDashboard?.data?.count_customer}</p>
            </div>
          </div>
        </Col>
      </Row>
      {allZero ? (
        <Result
          status="403"
          title="Chưa có doanh số"
          // subTitle="Tiếc quá hôm nay chưa có tiền rồi ^_^"
        />
      ) : (
        <Row gutter={[8, 8]} align={"middle"}>
          <Col xl={14} lg={24} md={24} sm={24}>
            <div className="chart">
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                  <ComposedChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 50,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis
                      dataKey="Thời gian"
                      scale="auto"
                      label={{
                        value: "Thời gian",
                        position: "insideBottomRight",
                        offset: -20,
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) => value.toLocaleString()}
                      label={{
                        value: "VNĐ",
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <Tooltip formatter={(value) => value.toLocaleString()} />
                    <Legend />
                    <Bar barSize={15} dataKey="Doanh thu" fill="#413ea0" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col xl={10} lg={24} md={24} sm={24}>
            <div style={{ width: 640 }} className="chart">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChart?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => value.toLocaleString() + " VNĐ"}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      payload={pieChart?.map((entry, index) => ({
                        value: entry.name,
                        type: "circle",
                        color: COLORS[index],
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
