import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // 从 react-router-dom 导入 BrowserRouter 和 Routes
import HomePage from "./pages/HomePage"; // 引入你的 HomePage 组件
import OneFloorQuotePage from "./pages/OneFloorQuotePage"; // 1F报价页面
import TwoFloorQuotePage from "./pages/TwoFloorQuotePage"; // 2F报价页面

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
      </Routes>
    </Router>
  );
}

export default App;
