import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // 人头图标
import { useState, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // 获取用户名，如果已登录
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUsername(null); // 清除用户名状态
    navigate("/quote/login");
  };

  const handleLoginClick = () => {
    if (username) {
      // 如果已经登录，点击名字跳转到 admin home 页面
      navigate("/quote/adminhome");
    } else {
      // 否则跳转到 login 页面
      navigate("/quote/login");
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-400 to-blue-200 text-white p-4 flex items-center justify-between shadow-md rounded-full">
      {/* 左边 Logo */}
      <div className="flex items-center h-full">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-20 mr-3 object-contain rounded-full"
          onClick={() => navigate("/")} // 点击 logo 跳转到主页
        />
      </div>

      {/* 中间文字 */}
      <div className="flex items-center justify-center flex-1">
        <span className="text-8xl font-bold font-serif">Auto Quotation</span>
      </div>

      {/* 右侧 用户名或登录按钮 */}
      <div className="flex items-center space-x-4">
        {username ? (
          <>
            <span className="cursor-pointer text-xl" onClick={handleLoginClick}>
              Hi {username} {/* 显示用户名 */}
            </span>
            <button
              onClick={handleLogout}
              className="text-white bg-blue-500 p-2 rounded-full hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600">
            <User size={24} /> {/* 显示人头图标 */}
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
