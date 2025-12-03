import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OneFloorQuotePage from "./pages/OneFloorQuotePage";
import TwoFloorQuotePage from "./pages/TwoFloorQuotePage";
import LoginPage from "./pages/LoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import RateManagementPage from "./pages/RateManagementPage";
import RateDetailsPage from "./pages/RateDetailsPage";
import AddRatePage from "./pages/AddRatePage";
import CompanyManagementPage from "./pages/CompanyManagementPage";

// 登录有效期设置为 1 小时
const TOKEN_EXPIRY = 3600 * 1000;

// 登录检查函数
function checkLogin() {
  const token = localStorage.getItem("authToken");
  const loginTime = localStorage.getItem("loginTime");

  if ((!token || !loginTime || Date.now() - loginTime > TOKEN_EXPIRY) &&
    window.location.pathname !== "/quote/login") {
  localStorage.removeItem("authToken");
  localStorage.removeItem("username");
  localStorage.removeItem("loginTime");
  window.location.href = "/quote/login";
}

}

function App() {
  useEffect(() => {
    checkLogin(); // 每次页面加载时检查登录状态

    // 可选：用户操作刷新登录时间
    const refreshLoginTime = () => {
      if (localStorage.getItem("authToken")) {
        localStorage.setItem("loginTime", Date.now());
      }
    };
    document.addEventListener("click", refreshLoginTime);

    // 清理事件监听
    return () => document.removeEventListener("click", refreshLoginTime);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quote/1F" element={<OneFloorQuotePage />} />
        <Route path="/quote/2F" element={<TwoFloorQuotePage />} />
        <Route path="/quote/login" element={<LoginPage />} />
        <Route path="/quote/adminhome" element={<AdminHomePage />} />
        <Route path="/quote/rate-management" element={<RateManagementPage />} />
        <Route path="/quote/rate/:rateId" element={<RateDetailsPage />} />
        <Route path="/quote/add-rate" element={<AddRatePage />} />
        <Route
          path="/quote/company-management"
          element={<CompanyManagementPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
