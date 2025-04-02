import { Col, DatePicker, Divider, Form, Row, Select, Spin } from "antd";
import { Helmet } from "react-helmet";
// import { rangePresets } from "../../../utils/dateTime";
import dayjs from "dayjs";
import Total from "./Total";
import { useCallback, useEffect, useState } from "react";
import { store } from "../../../redux/configStores";
import { getListBarChart, getListTotal, getListTotalWorker } from "../../../services/home/home";
import { useSelector } from "react-redux";
import { rangePresets } from "../../../utils/dateTime";
import TotalWorker from "./TotalWorker";
const { RangePicker } = DatePicker;
const content = <div />;
export default function Home() {
  const [form] = Form.useForm();
  const [currentPicker, setCurrentPicker] = useState("day");
  const { listToTalDashboard, listBarChart,listTotalWorker } = useSelector(
    (state) => state.home
  );
  const handleChangeDate = (value) => {
    setCurrentPicker(value);
    form.resetFields(["datepicker"]);
  };
  const [isLoadingChange, setIsLoadingChange] = useState();
  const handleFormChange = useCallback(async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue(["type", "datepicker"]);
      const rangeTimeValue = values["datepicker"];
      if (rangeTimeValue !== undefined && rangeTimeValue !== null) {
        let newData;
        if (values.type === "month") {
          newData = {
            type: values.type,
            time_start: rangeTimeValue[0]?.format("YYYY-MM"),
            time_end: rangeTimeValue[1]?.format("YYYY-MM"),
          };
        } else {
          newData = {
            type: values.type,
            time_start: rangeTimeValue[0]?.format("YYYY-MM-DD"),
            time_end: rangeTimeValue[1]?.format("YYYY-MM-DD"),
          };
        }
        // console.log(newData);
        setIsLoadingChange(true);
        await Promise.all([
          store.dispatch(
            getListTotal({
              time_start: newData.time_start,
              time_end: newData.time_end,
              type: newData.type,
            })
          ),
          store.dispatch(
            getListBarChart({
              time_start: newData.time_start,
              time_end: newData.time_end,
              type: newData.type,
            })
          ),
          store.dispatch(
            getListTotalWorker({
              time_start: newData.time_start,
              time_end: newData.time_end,
              type: newData.type,
            })
          ),
        ]);
        setIsLoadingChange(false);
      }
    } catch (error) {
      setIsLoadingChange(false);
    }
  }, [form]);

  useEffect(() => {
    const defaultDatepicker = [dayjs().startOf("day"), dayjs().endOf("day")];
    form.setFieldsValue({
      type: "day",
      datepicker: defaultDatepicker,
    });
    handleFormChange(form.getFieldsValue());
  }, [form, handleFormChange]);
  const disabledDate = (current) => {
    if (currentPicker === "day") {
      return (
        current > dayjs().endOf("day").add(0, "day") ||
        current < dayjs().subtract(31, "day")
      );
    } else if (currentPicker === "month") {
      return (
        current > dayjs().endOf("month").add(0, "month") ||
        current < dayjs().subtract(11, "month").startOf("month")
      );
    }
    return false;
  };
  return (
    <div>
      <Helmet>
        <title>Trang chủ</title>
        <meta name="description" content="Trang thống kê auto-care" />
      </Helmet>
      <div className="home-dashboard">
        <h2>Tổng quan</h2>
        <Form
          onValuesChange={(changedValues, allValues) => {
            if ("type" in changedValues || "datepicker" in changedValues) {
              handleFormChange(allValues);
            }
          }}
          layout="vertical"
          name="dashboard"
          form={form}
        >
          <Row gutter={[16, 16]} align={"middle"}>
            <Col xl lg md sm>
              <Form.Item
                name="type"
              >
                <Select
                  onChange={handleChangeDate}
                  style={{ width: 100, marginRight: 10 }}
                  placeholder="Chọn theo loại"
                >
                  <Select.Option value="day">Ngày</Select.Option>
                  <Select.Option value="month">Tháng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl lg md sm>
              <Form.Item
                // required={true}
                name="datepicker"
              >
                <RangePicker
                  disabledDate={disabledDate}
                  presets={currentPicker === "month" ? null : rangePresets}
                  picker={currentPicker}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Divider />
        {isLoadingChange && (
          <Spin tip="Đang tải dữ liệu ..." size="default">
            {content}
          </Spin>
        )}
           <div className="total-group">
           <Total
          listToTalDashboard={listToTalDashboard}
          listBarChart={listBarChart}
        />
          <TotalWorker listTotalWorker={listTotalWorker} isLoadingChange={isLoadingChange}/>
      </div>
      
      
      </div>
    </div>
  );
}
