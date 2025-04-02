import { Navigate, Outlet, useLocation } from "react-router-dom";
import { settings } from "../../utils/config";
export default function RouterPrivate() {
  const location = useLocation();
  // Kiểm tra nếu người dùng là khách hàng và có access_token
  const isAdmin = settings?.getCookie("type") === "ADMIN";
  const isWorkShop = settings?.getCookie("type") === "WORKSHOP";
  const hasAccessToken = settings?.getCookie("access_token");
  const currentPath = location.pathname;
  // Các đường dẫn được phép cho khách hàng và không phải khách hàng
  const allowedRoutesForAdmin = [
    "/branch-name",
    "/company",
    "/company-zns-temp",
    "/account",
    "/quota",
    // "/category-post",
    "/post",
  ];
  const allowedRoutesForWorkShop = [
    "/",
    "/companyBranch",
    "/accountManage",
    "/post",
  ];

  // Kiểm tra và điều hướng người dùng đến các trang phù hợp
  if (isAdmin && hasAccessToken) {
    // Nếu là khách hàng và có access_token
    if (allowedRoutesForAdmin.includes(currentPath)) {
      // Nếu đường dẫn hiện tại trong danh sách đường dẫn cho khách hàng, cho phép truy cập
      return <Outlet />;
    } else if (currentPath === "/category-post" || currentPath === "/post") {
      return <Outlet />;
    } else {
      // Nếu đường dẫn hiện tại không phù hợp, điều hướng đến trang phù hợp cho khách hàng
      return <Navigate to={"/company"} />;
    }
  } else if (!isAdmin && hasAccessToken) {
    if (isWorkShop) {
      // Nếu là khách hàng và có access_token
      if (allowedRoutesForWorkShop.includes(currentPath)) {
        // Nếu đường dẫn hiện tại trong danh sách đường dẫn cho khách hàng, cho phép truy cập
        return <Outlet />;
      } else {
        // Nếu đường dẫn hiện tại không phù hợp, điều hướng đến trang phù hợp cho khách hàng
        return <Navigate to={"/"} />;
      }
    } else {
      // Nếu không phải là khách hàng
      if (!allowedRoutesForAdmin.includes(currentPath)) {
        // Nếu đường dẫn hiện tại không phải là đường dẫn cho người không phải khách hàng, cho phép truy cập
        return <Outlet />;
      } else if (currentPath === "/category-post" || currentPath === "/post") {
        return <Outlet />;
      } else {
        // Nếu đường dẫn hiện tại là đường dẫn không phù hợp cho người không phải khách hàng, điều hướng về trang chủ
        return <Navigate to={"/"} />;
      }
    }
  } else {
    // Nếu là khách hàng nhưng không có access_token, điều hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }
}
