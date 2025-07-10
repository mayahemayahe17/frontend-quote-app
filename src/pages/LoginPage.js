import React, { useState } from "react"; // 引入 useState
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"; // 引入 Footer 组件
import Header from "../components/Header";
import { Eye, EyeOff } from "lucide-react"; // 导入眼睛图标（需要安装 lucide-react）

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // 用户名状态
  const [password, setPassword] = useState(""); // 密码状态
  const [error, setError] = useState(""); // 错误信息状态
  const [loading, setLoading] = useState(false); // 加载状态
  const [showPassword, setShowPassword] = useState(false); // 密码是否可见

  // Handlers 处理各种输入
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // 切换密码显示状态
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止默认的表单提交

    // 验证输入
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    setLoading(true);
    setError(""); // 清空错误信息

    try {
      // 发送 POST 请求到后端验证用户
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 登录失败
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        // 登录成功，存储 token
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", username); // 保存用户名
        // 跳转到 Admin Home 页
        navigate("/quote/adminhome");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // 停止加载状态
    }
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
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6 relative">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type={showPassword ? "text" : "password"} // 根据 showPassword 状态决定密码的显示或隐藏
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-10 text-gray-600">
                  {showPassword ? <EyeOff /> : <Eye />} {/* 显示眼睛图标 */}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
                disabled={loading} // 禁用按钮，防止重复提交
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}{" "}
            {/* 显示错误信息 */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LoginPage;
