import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "../../../redux/configStores";
import {
  Breadcrumb,
  // Button,
  Col,
  DatePicker,
  Divider,
  Flex,
  Input,
  Row,
  Select,
  Skeleton,
  Table,
} from "antd";
// import { ReactToPrint } from "react-to-print";
// import { PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getDetailTimekeeping,
  getListAllEmployee,
} from "../../../services/timekeeping/timekeeping";
import { debounce } from "lodash";
import { settings } from "../../../utils/config";
import UpdateNoteTimekeeping from "./UpdateNoteTimekeeping";

export default function DetailTimekeeping() {
  const {
    detailTimekeeping,
    isLoadDetailTimekeeping,
    listAllEmployee,
    isLoadListAllEmployee,
  } = useSelector((state) => state.timekeeping);
  const dataDetailTimekeeping = detailTimekeeping
    ? Object.values(detailTimekeeping)
    : [];

    // const [dataDetailTimekeeping, setDataDetailTimekeeping] = useState(detailTimekeeping
    //   ? Object.values(detailTimekeeping)
    //   : [])

  const optionsListEmployee = listAllEmployee?.data?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  // const componentRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { userData } = useSelector((state) => state.user);
  const company_id =
    userData?.data?.company_id || settings?.getCookie("company_id");

    const showEdit = useRef(null);
    const handleShowEdit = (record) => {
      showEdit.current.showModalEdit(record);
    };
  const columns = [
    {
      title: "Ngày chấm công",
      dataIndex: "ngay_cc",
      editable: true,
      width: "10%",
    },
    {
      title: "Giờ vào",
      dataIndex: "time_in",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "Giờ ra",
      dataIndex: "time_out",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "Tổng số giờ làm",
      dataIndex: "total_working_real",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "Xác nhận đủ công",
      // dataIndex: "is_enough_time",
      align: "center",
      editable: true,
      width: "10%",
      // render: (record) => {
      //   if (record.total_working) {
      //     if (record.is_enough_time) {
      //       return <p style={{ color: "#0000ff" }}>True</p>;
      //     } else {
      //       return <p style={{ color: "#ff0000" }}>False</p>;
      //     }
      //   } else {
      //     return null;
      //   }
      // },
      render: (record) => {
        if (record.is_enough_time) {
          return <p style={{ color: "#0000ff" }}>Đủ công</p>;
        } else {
          return <p style={{ color: "#ff0000" }}>Không đủ công</p>;
        }
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      align: "center",
      editable: true,
      width: "10%",
      render: (_, record) => {
        if(record.time_in || record.time_out) {
        return (
          record.note
        );
      } else{
        return null;
      }
      },
    },
    {
      title: "Sửa",
      dataIndex: "operation",
      align: "center",
      editable: true,
      width: "10%",
      render: (_, record) => {
        if(record.time_in || record.time_out) {
        return (
          <Flex align="center" justify="center" gap={10}>
            <UpdateNoteTimekeeping
              id={id}
              record={record}
              ref={showEdit}
              company_id={company_id}
              selectedDate= {selectedDate}
            />
          </Flex>
        );
      } else{
        return null;
      }
      },
    },
  ];

  const delayedFilter = useRef(
    debounce((formattedMonth, formattedYear) => {
      store.dispatch(
        getDetailTimekeeping({
          id,
          month: formattedMonth,
          year: formattedYear,
          company_id,
        })
      );
    }, 600)
  ).current;

  const handleDateChange = (date) => {
    if (date) {
      const formattedMonth = dayjs(date).format("MM");
      const formattedYear = dayjs(date).format("YYYY");
      setSelectedDate(date);
      delayedFilter(formattedMonth, formattedYear);
    } else {
      const formattedMonth = dayjs().month() + 1;
      const formattedYear = dayjs().year();
      setSelectedDate(dayjs());
      delayedFilter(formattedMonth, formattedYear);
    }
  };

  const handleChangeEmployee = (value) => {
    navigate(`/detail-timekeeping/${value}`); // Update URL with new user ID
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        getDetailTimekeeping({
          id,
          month: dayjs().month() + 1,
          year: dayjs().year(),
          company_id,
        })
      );
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    const callApi = async () => {
      // dispatch(setHasFetchData(true));
      await Promise.all[dispatch(getListAllEmployee())];
    };
    callApi();
  }, []);

  return (
    <div>
      <h2>Chi tiết thông tin chấm công</h2>
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
            title: "Danh sách chấm công",
            href: "/list-timekeeping",
          },
          {
            title: "Chi tiết",
            href: `/detail-timekeeping/${id}`,
          },
        ]}
      />
      {/* <Row>
        <ReactToPrint
          trigger={() => (
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              style={{ margin: "10px" }}
            >
              In Phiếu Chấm Công
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Row> */}

      <div className="detail-vehicle-maintain">
        <div style={{ padding: 30 }}>
          {isLoadDetailTimekeeping ? (
            <Skeleton active paragraph={{ rows: 16 }} />
          ) : (
            <>
              <>
                <Row gutter={[16, 16]}>
                  <Col xl={12} lg={12} md={12} sm={6}>
                    <p>
                      Nhân viên:{" "}
                      <Select
                        showSearch
                        virtual
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.label
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        filterSort={(optionA, optionB) =>
                          optionA?.label
                            ?.toLowerCase()
                            .localeCompare(optionB?.label?.toLowerCase())
                        }
                        disabled={isLoadListAllEmployee}
                        placeholder="Vui lòng chọn nhân viên"
                        options={optionsListEmployee}
                        onChange={handleChangeEmployee}
                        value={Number(id)}
                        style={{ minWidth: "300px" }}
                        // optionLabelProp="label"
                      />
                    </p>
                  </Col>
                  {/* <Col xl={12} lg={12} md={12} sm={6}>
                    <p>
                      Tên nhân viên:{" "}
                      <Typography.Text>
                        {dataDetailTimekeeping.length > 0 &&
                          dataDetailTimekeeping[0]?.m_username}
                      </Typography.Text>
                    </p>
                  </Col> */}
                  <Col xl={12} lg={12} md={12} sm={6}>
                    <p>
                      Tháng:{" "}
                      <DatePicker
                        onChange={handleDateChange}
                        picker="month"
                        defaultValue={dayjs()}
                        value={selectedDate}
                        format="MM/YYYY"
                        allowClear={false}
                      />
                    </p>
                  </Col>
                </Row>
                <Divider />
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={dataDetailTimekeeping || []}
                  scroll={{
                    x: "max-content",
                  }}
                />
              </>
            </>
          )}
        </div>
      </div>
    </div>


  );
}
