import React, { useState } from "react"; //导入react库，且用useState来管理用户输入的公司名字
import { useNavigate } from "react-router-dom"; // 导入 useNavigate 用于跳转
import Header from "../components/Header"; // 引入 Header 组件
import Footer from "../components/Footer"; // 引入 Footer 组件

function HomePage() {
  const [company, setCompany] = useState(""); // 用户输入的公司名称
  const [floor, setFloor] = useState("1F"); // 默认楼层选项
  const navigate = useNavigate(); // 使用 Navigate 进行页面跳转

  const getQuote = async () => {
    if (!company) {
      alert("Please enter a company name.");
      return;
    }

    try {
      // 去除前后空格后再发送请求
      const cleanedCompanyName = company.trim(); // 去掉前后的空格
      console.log(
        `Sending request for Company: ${cleanedCompanyName}, Floor: ${floor}`
      );

      // 确保 API 路径正确
      const response = await fetch(
        `http://localhost:3000/quote?name=${cleanedCompanyName}&floor=${floor}`
      );

      // 检查响应是否成功
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();
      console.log("Response data:", data); // 输出返回的数据

      // 在这里处理返回的数据，显示报价等
      alert(
        `Received quote for ${cleanedCompanyName}: ${JSON.stringify(data)}`
      );

      // 根据楼层类型跳转到对应的报价页面，并将整个 response 作为 state 传递过去
      if (floor === "1F") {
        navigate(`/quote/1F`, {
          state: { ...data, company: cleanedCompanyName },
        }); // 将 data 作为 state 传递
      } else if (floor === "2F") {
        navigate(`/quote/2F`, {
          state: { ...data, company: cleanedCompanyName },
        }); // 将 data 作为 state 传递
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      alert("Failed to fetch quote, please try again.");
    }
  };

  //基本框架的搭建。有header，main，和footer
  return (
    /* 一级大框 */
    <div className="flex flex-col min-h-screen bg-blue-300">
      {/* 二级框：引入Header 组件 */}
      <Header />

      {/* 二级框：Main content */}
      <main
        className="flex-1 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/background.jpg)",
        }}>
        {/* 三级框：输入公司名 */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 w-[350px]">
          <h2 className="text-xl font-semibold mb-4 text-center">Search</h2>

          {/* 输入公司名称 */}
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company Name"
            className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* 楼层选择 */}
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                name="floor"
                value="1F"
                checked={floor === "1F"}
                onChange={() => setFloor("1F")}
              />
              <span className="ml-1">Single Storey</span>
            </label>
            <label>
              <input
                type="radio"
                name="floor"
                value="2F"
                checked={floor === "2F"}
                onChange={() => setFloor("2F")}
              />
              <span className="ml-1">Two Storey</span>
            </label>
          </div>

          {/* 查询按钮 */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={getQuote}>
            {" "}
            {/* 调用 getQuote 函数 */}
            Start
          </button>
        </div>
      </main>
      {/* 二级框：Footer */}
      {/* 引入 Footer 组件 */}
      <Footer />
    </div>
  );
}

export default HomePage;
