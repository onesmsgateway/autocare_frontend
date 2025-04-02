import React, { Suspense } from "react";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import "dayjs/locale/vi";
import viVN from "antd/lib/locale/vi_VN";
import { Provider } from "react-redux";
import { store } from "../redux/configStores";
const Body = React.lazy(() => import("../components/Body/Body"));
const Home = React.lazy(() => import("../pages/Content/Home/Home"));
import { ConfigProvider, Empty } from "antd";
import ProgressLoading from "../components/Loading/ProgressLoading";
import Login from "../pages/Login/Login";
import TableCustomer from "../pages/Content/Customers/TableCustomer";
import TableGroupCustomer from "../pages/Content/GroupCustomer/TableGroupCustomer";
import RouterPrivate from "../components/PrivateLogin/RouterPrivate";
import CheckLogin from "../components/PrivateLogin/CheckLogin";
import TableSupplier from "../pages/Content/Supplier/TableSupplier";
import TableDepartment from "../pages/Content/Department/TableDepartment";
import TableSms from "../pages/Content/Sms/TableSms";
import TablePosition from "../pages/Content/Position/TablePosition";
import TableStaff from "../pages/Content/Staff/TableStaff";
import TableStaffRequest from "../pages/Content/StaffRequest/TableStaffRequest";

import TableTimekeeping from "../pages/Content/Timekeeping/TableTimekeeping";
import ConfigSms from "../pages/Content/Sms/ConfigSms/ConfigSms";
import TableMessengerTemplate from "../pages/Content/Sms/MessengerTemplate/TableMessengerTemplate";
import TableBranchName from "../pages/Content/Admin/BranchName/TableBranchName";
const TableCompany = React.lazy(() =>
  import("../pages/Content/Admin/Company/TableCompany")
);
import TableWareHouse from "../pages/Content/Warehouse/TableWareHouse";
import TableAccessary from "../pages/Content/Accessary/TableAccessary";
import EditUser from "../pages/Content/User/EditUser";
import TableAcount from "../pages/Content/Admin/Account/TableAcount";
import ScheduleSms from "../pages/Content/Sms/ScheduleSms";
import TableVehicleMaintenance from "../pages/Content/VehicleMaintenance/TableVehicleMaintenance";
import TableQuota from "../pages/Content/Admin/Quata/TableQuota";
import ForgotPassWord from "../pages/Login/ForgotPassWord";
import ResetPassWord from "../pages/Login/ResetPassWord";
import TableCarManage from "../pages/Content/CarManage/TableCarManage";
import DetailVehicleMaintenance from "../pages/Content/VehicleMaintenance/DetailVehicleMaintenance";
import TableJobCategory from "../pages/Content/JobCategory/TableJobCategory";
import AddCar from "../pages/Content/Customers/AddCar";
import AddMaintenance from "../pages/Content/CarManage/AddMaintenance";
import DetailCarManager from "../pages/Content/CarManage/DetailCarManager";
import DetailTimekeeping from "../pages/Content/Timekeeping/DetailTimekeeping";
import WorkingDaySetting from "../pages/Content/WorkingDaySetting/WorkingDaySetting";
import TableDayOffSetting from "../pages/Content/DayOffSetting/TableDayOffSetting";
import TableLeaveTypeSetting from "../pages/Content/LeaveTypeSetting/TableLeaveTypeSetting";
import GPSSetting from "../pages/Content/GPSSetting/GPSSetting";
import TablePostSetting from "../pages/Content/PostSetting/TablePostSetting";
import TableCategoryPost from "../pages/Content/CategoryPost/TableCategoryPost";
import TableCompanyBranch from "../pages/Content/Admin/CompanyBranch/TableCompanyBranch";
import TableAccountManage from "../pages/Content/Admin/AccountManage/TableAccountManage";
import PositionPermission from "../pages/Content/Position/Permission";
import TableMaintenanceDebt from "../pages/Content/MaintenanceDebt/TableMaintenanceDebt";
import TableCompanyZnsTemp from "../pages/Content/Admin/CompanyZnsTemp/TableCompanyZnsTemp";
// import DetailMaintenanceDebt from "../pages/Content/MaintenanceDebt/DetailMaintenanceDebt";

const history = createBrowserHistory();
export default function Router() {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: { fontFamily: " Noto Serif ", fontSize: 16 },
        }}
        locale={viVN}
        renderEmpty={Empty}
      >
        <HistoryRouter history={history}>
          <Suspense fallback={<ProgressLoading />}>
            <Routes>
              <Route path="" element={<RouterPrivate />}>
                <Route path="" element={<Body />}>
                  <Route index element={<Home />} />
                  <Route path="/customer" element={<TableCustomer />} />
                  <Route path="/add-car/:id" element={<AddCar />} />
                  <Route path="/add-car" element={<AddCar />} />
                  <Route path="/editUser" element={<EditUser />} />
                  <Route path="/account" element={<TableAcount />} />
                  <Route
                    path="/group-customer"
                    element={<TableGroupCustomer />}
                  />
                  <Route path="/supplier" element={<TableSupplier />} />
                  <Route path="/department" element={<TableDepartment />} />
                  <Route path="/sms" element={<TableSms />} />
                  <Route path="/schedule-sms" element={<ScheduleSms />} />
                  <Route path="/job-category" element={<TableJobCategory />} />
                  <Route path="/position" element={<TablePosition />} />
                  <Route path="/position/:positionId/permission" element={<PositionPermission />} />
                  <Route path="/staff" element={<TableStaff />} />
                  <Route path="/settings-sms" element={<ConfigSms />} />
                  <Route
                    path="/message-template"
                    element={<TableMessengerTemplate />}
                  />
                  <Route path="/branch-name" element={<TableBranchName />} />
                  <Route
                    path="/companyBranch"
                    element={<TableCompanyBranch />}
                  />
                  <Route
                    path="/accountManage"
                    element={<TableAccountManage />}
                  />
                  <Route path="/quota" element={<TableQuota />} />
                  <Route path="/company" element={<TableCompany />} />
                  <Route
                    path="/company-zns-temp"
                    element={<TableCompanyZnsTemp />}
                  />
                  <Route path="/warehouse" element={<TableWareHouse />} />
                  <Route path="/accessary" element={<TableAccessary />} />
                  <Route
                    path="/vehicle-maintenance"
                    element={<TableVehicleMaintenance />}
                  />
                  <Route path="/detail-vehicle-maintenance">
                    <Route path=":id" element={<DetailVehicleMaintenance />} />
                  </Route>
                  <Route path="/car-manage" element={<TableCarManage />} />
                  <Route
                    path="/detail-car-manage/:id"
                    element={<DetailCarManager />}
                  />
                  <Route path="/addMaintenance" element={<AddMaintenance />} />
                  <Route
                    path="/addMaintenance/:id"
                    element={<AddMaintenance />}
                  />
                  <Route
                    path="/maintenance-debts"
                    element={<TableMaintenanceDebt />}
                  />
                  {/* <Route path="/detail-maintenance-debt">
                    <Route path=":id" element={<DetailMaintenanceDebt />} />
                  </Route> */}
                  <Route path="/list-request" element={<TableStaffRequest />} />
                  <Route
                    path="/list-timekeeping"
                    element={<TableTimekeeping />}
                  />
                  <Route path="/detail-timekeeping">
                    <Route path=":id" element={<DetailTimekeeping />} />
                  </Route>
                  <Route
                    path="/working-day-setting"
                    element={<WorkingDaySetting />}
                  />
                  <Route
                    path="/leave-types-setting"
                    element={<TableLeaveTypeSetting />}
                  />
                  <Route
                    path="/day-off-setting"
                    element={<TableDayOffSetting />}
                  />
                  <Route path="/gps-setting" element={<GPSSetting />} />
                  <Route path="/post" element={<TablePostSetting />} />
                  <Route
                    path="/category-post"
                    element={<TableCategoryPost />}
                  />
                </Route>
              </Route>
              <Route path="" element={<CheckLogin />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassWord />} />
                <Route path="/reset-password" element={<ResetPassWord />} />
              </Route>
            </Routes>
          </Suspense>
        </HistoryRouter>
      </ConfigProvider>
    </Provider>
  );
}
