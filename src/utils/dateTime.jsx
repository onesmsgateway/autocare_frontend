import dayjs from "dayjs";
const formatDateTime = (createdAt) => {
  const date = new Date(createdAt);
  const formattedDateTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  return formattedDateTime;
};

export default formatDateTime;

export const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  return formattedDate;
};
export const calculateTimeDifference = (currentDate, endDate) => {
  const endDateTime = new Date(endDate);
  const currentDateTime = new Date(currentDate);

  const timeDifference = currentDateTime - endDateTime;

  // Chuyển đổi milliseconds thành đơn vị thời gian mong muốn (ví dụ: ngày, giờ, phút...)
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let formattedTimeDifference = "";

  if (days > 0) {
    formattedTimeDifference = `${days} ngày`;
  } else if (hours > 0) {
    formattedTimeDifference = `${hours} giờ`;
  } else {
    formattedTimeDifference = `${minutes} phút`;
  }

  return formattedTimeDifference;
};

// const startOfThisWeek = dayjs().startOf("week").day(1);
// const endOfThisWeek = dayjs().endOf("week") && dayjs().startOf("day");

// const startOfThisMonth = dayjs().startOf("month"); // Bắt đầu của tháng này
// const endOfThisMonth = dayjs().endOf("month") && dayjs().startOf("day"); // Kết thúc của tháng này
// const { RangePicker } = DatePicker;
// const startOfLastMonth = dayjs().subtract(1, "month").startOf("month"); // Bắt đầu của tháng trước
// const endOfLastMonth = dayjs().subtract(1, "month").endOf("month"); // Kết thúc của tháng trước
export const rangePresets = [
  {
    label: <span>Hôm nay</span>,
    value: [dayjs().startOf("day"), dayjs().endOf("day")],
  },
  {
    label: <span>Hôm qua</span>,
    value: [
      dayjs().subtract(1, "day").startOf("day"),
      dayjs().subtract(1, "day").endOf("day"),
    ],
  },
  {
    label: <span>7 ngày gần đây</span>,
    value: [
      dayjs().subtract(6, "day").startOf("day"),
      dayjs().subtract(0, "day").endOf("day"),
    ],
  },
  {
    label: <span>30 ngày gần đây</span>,
    value: [
      dayjs().subtract(29, "day").startOf("day"),
      dayjs().subtract(0, "day").endOf("day"),
    ],
  },
];

export const ConvertUrlImage = (url) => {
  const convertUrl = `${import.meta.env.VITE_IMAGE_URL}${url}`;
  return convertUrl;
};

export const ConvertStatus = (status) => {
  switch (status) {
    case "pending":
      return <p style={{ color: "#1677ff" }}>Chưa xử lý</p>;
    case "approved":
      return <p style={{ color: "green" }}>Đã chấp nhận</p>;
    case "rejected":
      return <p style={{ color: "#f5222d" }}>Đã từ chối</p>;
    default:
      return <p style={{ color: "#1677ff" }}></p>;
  }
};
