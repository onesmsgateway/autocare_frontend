import {
  HomeOutlined,
  MessageOutlined,
  UserOutlined,
  FolderOutlined,
  UsergroupAddOutlined,
  BranchesOutlined,
  ToolOutlined,
  DashboardOutlined,
  PlusCircleOutlined,
  CarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import { settings } from "../../utils/config";

const isAdmin = settings?.getCookie("type") === "ADMIN";
const isWorkShop = settings?.getCookie("type") === "WORKSHOP";
export const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Tổng Quan",
    path: "/",
  },
  {
    key: "customer",
    icon: <UsergroupAddOutlined />,
    label: "Khách hàng",
    path: "/",
    children: [
      {
        key: "list-customer",
        label: "Danh sách khách hàng",
        path: "/customer",
      },
      // {
      //   key: "group-customer",
      //   label: "Nhóm khách hàng",
      //   path: "/group-customer",
      // },
    ],
  },
  {
    key: "category",
    icon: <ToolOutlined />,
    label: "Phụ tùng, vật tư",
    children: [
      {
        key: "supplier",
        label: "Nhà cung cấp",
        path: "/supplier",
      },
      {
        key: "warehouse",
        label: " Kho",
        path: "/warehouse",
      },
      {
        key: "accessary",
        label: "Phụ tùng-vật tư",
        path: "/accessary",
      },
    ],
  },
  {
    key: "car",
    icon: <CarOutlined />,
    label: "Quản lý xe",
    path: "/",
    children: [
      {
        key: "add-car",
        label: "Thêm xe",
        path: "/add-car",
      },
      {
        key: "list-car",
        label: "Danh sách xe",
        path: "/car-manage",
      },
    ],
  },
  {
    key: "maintenance",
    icon: <DashboardOutlined />,
    label: "Bảo dưỡng, sửa chữa",
    path: "/",
    children: [
      {
        key: "add-maintenance",
        label: "Tạo mới",
        path: "/addMaintenance",
      },
      {
        key: "list-vehicle-maintenance",
        label: "Danh sách",
        path: "/vehicle-maintenance",
      },
    ],
  },
  {
    key: "maintenanceDebt",
    icon: <DollarCircleOutlined />,
    label: "Công nợ",
    path: "/",
    children: [
      {
        key: "list-maintenance-debt",
        label: "Danh sách",
        path: "/maintenance-debts",
      },
    ],
  },
  {
    key: "personnel",
    label: "Nhân sự",
    icon: <UserOutlined />,
    children: [
      {
        key: "department",
        label: "Bộ phận",
        path: "/department",
      },
      {
        key: "position",
        label: "Chức vụ",
        path: "/position",
      },
      {
        key: "staff",
        label: "Nhân viên",
        path: "/staff",
      },
    ],
  },
  {
    key: "sms",
    icon: <MessageOutlined />,
    label: "Tin nhắn",
    path: "/",
    children: [
      {
        key: "list-sms",
        label: "Danh sách tin nhắn",
        path: "/sms",
      },
      {
        key: "schedulesms",
        label: "Nhắn tin",
        path: "/schedule-sms",
      },
      {
        key: "message-template",
        label: "Mẫu tin nhắn",
        path: "/message-template",
      },
      {
        key: "config-sms",
        label: "Cấu hình",
        path: "/settings-sms",
      },
    ],
  },
  {
    key: "job",
    icon: <FolderOutlined />,
    label: "Công việc",
    path: "/job",
    children: [
      {
        key: "list-job",
        label: "Danh mục công việc",
        path: "/job-category",
      },
    ],
  },
  {
    key: "branchname",
    label: "Thương hiệu",
    icon: <BranchesOutlined />,
    children: [
      {
        key: "list-company",
        label: "Quản lý công ty",
        path: "/company",
      },
      {
        key: "list-company-zns-temp",
        label: "Quản lý temp zns",
        path: "/company-zns-temp",
      },
      {
        key: "list-branchname",
        label: "Quản lý thương hiệu",
        path: "/branch-name",
      },
    ],
  },
  {
    key: "companyBranch",
    label: "Chi nhánh",
    icon: <BranchesOutlined />,
    children: [
      {
        key: "list-company-branch",
        label: "Quản lý chi nhánh",
        path: "/companyBranch",
      },
    ],
  },
  {
    key: "account",
    label: "Tài khoản",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        key: "list-account",
        label: "Quản lý tài khoản",
        path: "/account",
      },
    ],
  },
  {
    key: "accountManage",
    label: "Tài khoản quản lý",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        key: "list-account-manage",
        label: "Quản lý tài khoản quản lý",
        path: "/accountManage",
      },
    ],
  },
  {
    key: "quota",
    label: "Cấp Quota",
    icon: <PlusCircleOutlined />,
    children: [
      {
        key: "list-quota",
        label: "Quản lý quota",
        path: "/quota",
      },
    ],
  },
  {
    key: "timekeeping",
    label: "Chấm công",
    icon: <CalendarOutlined />,
    children: [
      {
        key: "list-timekeeping",
        label: "Danh sách chấm công",
        path: "/list-timekeeping",
      },
      {
        key: "list-request",
        label: "Danh sách yêu cầu nghỉ",
        path: "/list-request",
      },
      {
        key: "working-day-setting",
        label: "Cài đặt ngày làm việc",
        path: "/working-day-setting",
      },
      {
        key: "leave-types-setting",
        label: "Cài đặt loại nghỉ việc",
        path: "/leave-types-setting",
      },
      {
        key: "day-off-setting",
        label: "Cài đặt ngày nghỉ",
        path: "/day-off-setting",
      },
      {
        key: "gps-setting",
        label: "Cài đặt GPS",
        path: "/gps-setting",
      },
    ],
  },
  {
    key: "post",
    label: "Bài viết",
    icon: <FileTextOutlined />,
    children:
      isAdmin || isWorkShop
        ? [
          {
            key: "post",
            label: "Quản lý bài viết ",
            path: "/post",
          },
        ]
        : [
          {
            key: "category-post",
            label: "Quản lý danh mục ",
            path: "/category-post",
          },
          {
            key: "post",
            label: "Quản lý bài viết ",
            path: "/post",
          },
        ],
  },
];
export const rootSubmenuKeys = [
  "home",
  "customer",
  "category",
  "sms",
  "personnel",
  "branchname",
  "companyBranch",
  "account",
  "job",
  "maintenance",
  "maintenanceDebt",
  "quota",
  "car",
  "timekeeping",
  "post",
];
