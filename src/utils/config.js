import axios from "axios";
import { persistor } from "../redux/configStores";
export const settings = {
  setStorageJson: (name, data) => {
    data = JSON.stringify(data);
    localStorage.setItem(name, data);
  },
  setStorage: (name, data) => {
    localStorage.setItem(name, data);
  },
  getStorageJson: (name) => {
    if (localStorage.getItem(name)) {
      const data = JSON.parse(localStorage.getItem(name));
      return data;
    }
    return; //undefined
  },
  getStore: (name) => {
    if (localStorage.getItem(name)) {
      const data = localStorage.getItem(name);
      return data;
    }
    return; //undefined
  },
  setCookieJson: (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    value = JSON.stringify(value);
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  getCookieJson: (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return JSON.parse(c.substring(nameEQ.length, c.length));
    }
    return null;
  },
  setCookie: (name, value, days) => {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  delete_cookie: (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
  getCookie: (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  eraseCookie: (name) => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};
export const reGexIsNumber = /^[0-9]+$/;
export const reGexPhone =
  /^(0||84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])\d{7}$/;
export const reGexLicensePlates = /^[0-9]{1,2}[A-Z]{1,2}[0-9]?-?[0-9]{4,5}$/;
// export const reGexLicensePlates = /^[0-9]{1,2}-?[A-Z]{1,2}-?[0-9]{1,5}[0-9]{1,2}$/;

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //tất cả các hàm khi gọi api đều sử dụng domain này
  timeout: 15000,
});
//Cấu hình cho request: Client gửi api đến server
http.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${settings.getCookie("access_token")}`,
    };
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);
//cấu hình cho response: Server sẽ trả dữ liệu về cho client
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Thất bại của tất cả request sử dụng http sẽ trả vào đây
    if (error.response && error.response.status === 401) {
      // alert("Có người khác đăng nhập vào tài khoản của bạn")
      persistor.pause();
      persistor.flush().then(() => {
        settings.delete_cookie("access_token");
        settings.delete_cookie("type");
        settings.delete_cookie("company_id");
        window.location.assign("/login");
        return persistor.purge();
      });
    }
    console.log(error);
    return Promise.reject(error);
  }
);
