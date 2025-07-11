import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // 从 react-router-dom 导入 BrowserRouter 和 Routes
import HomePage from "./pages/HomePage"; // 引入你的 HomePage 组件
import OneFloorQuotePage from "./pages/OneFloorQuotePage"; // 1F报价页面
import TwoFloorQuotePage from "./pages/TwoFloorQuotePage"; // 2F报价页面
import LoginPage from "./pages/LoginPage"; //登陆页面
import AdminHomePage from "./pages/AdminHomePage";
import RateManagementPage from "./pages/RateManagementPage";
import RateDetailsPage from "./pages/RateDetailsPage";
import AddRatePage from "./pages/AddRatePage";
import CompanyManagementPage from "./pages/CompanyManagementPage";

function App() {
  return (
    <Router>
      {" "}
      {/* 使用 BrowserRouter（Router 的别名） */}
      <Routes>
        {" "}
        {/* 使用 Routes 代替 Switch */}
        <Route path="/" element={<HomePage />} /> {/* 主页路由 */}
        <Route path="/quote/1F" element={<OneFloorQuotePage />} />{" "}
        {/* 1F报价页面 */}
        <Route path="/quote/2F" element={<TwoFloorQuotePage />} />{" "}
        {/* 2F报价页面 */}
        <Route path="/quote/login" element={<LoginPage />} />
        {/* 登录页面 */}
        <Route path="/quote/adminhome" element={<AdminHomePage />} />{" "}
        {/* 添加 AdminHomePage 路由 */}
        <Route
          path="/quote/rate-management"
          element={<RateManagementPage />}
        />{" "}
        {/* 报价管理页面 */}
        <Route path="/quote/rate/:rateId" element={<RateDetailsPage />} />{" "}
        {/* Rate细节页面 */}
        <Route path="/quote/add-rate" element={<AddRatePage />} />
        {/* 添加Rate页面 */}
        {/* 公司管理 */}
        <Route
          path="/quote/company-management"
          element={<CompanyManagementPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
