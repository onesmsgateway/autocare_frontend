import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import login from "./Login/login";
import customer from "./customer/customer";
import groupCustomer from "./groupCustomer/groupCustomer";
import user from "./user/user";
import supplier from "./supplier/supplier";
import departments from "./departments/departments";
import sms from "./sms/sms";
import job from "./job/job";
import position from "./position/position";
import stores from "./stores/stores";
import staff from "./staff/staff";
import hasFetchData from "./hasFetchData/hasFetchData";
import branchname from "./branchname/branchname";
import company from "./company/company";
import companyBranch from "./companyBranch/companyBranch";
import warehouse from "./warehouse/warehouse";
import accessarys from "./accessarys/accessarys";
import account from "./account/account";
import accountManage from "./accountManage/accountManage";
import vehicleMaintenance from "./vehicleMaintenance/vehicleMaintenance";
import quota from "./quota/quota";
import carmanage from "./carmanage/carmanage";
import jobCategory from "./jobCategory/jobCategory";
import home from "./home/home";
import notifications from "./notifications/notifications";
import timekeeping from "./timekeeping/timekeeping";
import post from "./post/post";
import miniDashboard from "./miniDashboard/miniDashboard";
import maintenanceDebt from "./maintenanceDebt/maintenanceDebt";
import companyZnsTemp from "./companyZnsTemp/companyZnsTemp";

const persistConfig = {
  key: "data",
  storage,
  whitelist: [""],
};

export const rootReducers = combineReducers({
  hasFetchData,
  login,
  user,
  customer,
  groupCustomer,
  supplier,
  departments,
  sms,
  job,
  jobCategory,
  position,
  stores,
  staff,
  timekeeping,
  branchname,
  company,
  companyBranch,
  companyZnsTemp,
  warehouse,
  accessarys,
  account,
  accountManage,
  vehicleMaintenance,
  quota,
  carmanage,
  home,
  notifications,
  post,
  miniDashboard,
  maintenanceDebt
});
console.log('ff', maintenanceDebt);
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
const persistedReducer = persistReducer(persistConfig, rootReducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunkMiddleware),
  devTools: import.meta.env.MODE !== "production",
});

export const persistor = persistStore(store);
