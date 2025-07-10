import React from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate 用于页面跳转
import Footer from "../components/Footer"; // 引入 Footer 组件
import Header from "../components/Header"; // 引入 Header 组件

function AdminHomePage() {
  const navigate = useNavigate(); // 获取 navigate 函数

  // 跳转到公司管理页面
  const goToCompanyManagement = () => {
    navigate("/quote/company-management");
  };

  // 跳转到 rate 管理页面
  const goToRateManagement = () => {
    navigate("/quote/rate-management");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 relative bg-gray-100">
        <img
          src="/images/background.jpg"
          alt="Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

        <div className="relative z-20 flex items-center justify-center h-full py-20">
          <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-96">
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
              Admin Dashboard
            </h2>
            <div className="space-y-4">
              <button
                onClick={goToCompanyManagement}
                className="w-full bg-slate-200 hover:bg-blue-500 text-black py-2 rounded font-semibold">
                Company Management
              </button>
              <button
                onClick={goToRateManagement}
                className="w-full bg-slate-200 hover:bg-blue-500 text-black py-2 rounded font-semibold">
                Rate Management
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AdminHomePage;
