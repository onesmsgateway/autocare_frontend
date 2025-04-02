import { Navigate, Outlet } from "react-router-dom";
import { settings } from "../../utils/config";
export default function CheckLogin() {
  const isCustomer = settings?.getCookie("type") === "ADMIN";
  const hasAccessToken = settings?.getCookie("access_token");
  if (hasAccessToken && isCustomer) {
    return <Navigate to="/company" />;
  } else if (hasAccessToken && !isCustomer) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }

}
