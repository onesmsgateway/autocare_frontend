import { Empty, Flex, Skeleton, Table } from "antd";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
export default function TotalWorker({ listTotalWorker, isLoadingChange }) {
  // console.log(listTotalWorker)
  const listTransition = listTotalWorker?.map((item, index) => {
    return {
      key: index,
      name: item?.name,
      phone: item?.phone,
      birth_day: item?.birth_day,
      address: item?.address,
      wage: item?.total_wage,
    };
  });
  // console.log(listTransition)
  const [data, setData] = useState();
  useEffect(() => {
    const data = listTotalWorker?.map((item) => {
      return {
        "Tên thợ": item?.name,
        "Số tiền": item?.total_wage,
      };
    });
    setData(data);
  }, [listTotalWorker]);
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_day",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Số tiền",
      dataIndex: "wage",
      render: (record) => record?.toLocaleString(),
    },
  ];
  const [showTable, setShowTable] = useState(false);
  const handleShowTable = () => {
    setShowTable(!showTable);
  };
  return (
    <>
      <NavLink onClick={handleShowTable}>
        Top thợ sửa chữa mang lại doanh thu nhiều nhất{" "}
      </NavLink>
      <div className="chart">
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <ComposedChart
              layout="vertical"
              data={data}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis
                type="number"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis dataKey="Tên thợ" type="category" scale="auto"  />
              <Tooltip formatter={(value) => value.toLocaleString() + " VNĐ"} />
              <Legend />
              <Bar dataKey="Số tiền" barSize={30} fill="#f5222d" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      {showTable && (
        <Table
          loading={listTransition?.length === 0 ? isLoadingChange : false}
          dataSource={isLoadingChange ? [] : listTransition}
          locale={{
            emptyText: isLoadingChange ? (
              <Flex vertical gap={20}>
                {[...Array(listTransition?.length || 0)].map((_, rowIndex) => (
                  <Flex gap={10} key={rowIndex}>
                    {columns.map((column) => (
                      <Skeleton.Input
                        key={`${column.dataIndex}-${rowIndex}`}
                        active={true}
                        size="small"
                        style={{ width: "95%" }}
                      />
                    ))}
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Empty />
            ),
          }}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: 1000 }}
        />
      )}
    </>
  );
}
