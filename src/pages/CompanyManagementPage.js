import React, { useEffect, useState } from "react";
import Header from "../components/Header"; // 引入Header组件
import Footer from "../components/Footer"; // 引入Footer组件

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CompanyManagementPage() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false); // 控制弹窗显示
  const [newCompanyName, setNewCompanyName] = useState(""); // 新公司名称
  const [error, setError] = useState(""); // 错误信息

  // 获取所有公司及其报价
  useEffect(() => {
    fetch(`${API_BASE_URL}/companies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // 获取每个公司 1F 和 2F 的报价
        const updatedCompanies = data.companies.map((company) => {
          return fetchRate(company.name, "1F").then((rate1F) =>
            fetchRate(company.name, "2F").then((rate2F) => ({
              ...company,
              rate1F,
              rate2F,
            }))
          );
        });

        // 确保所有异步请求都完成后更新公司列表
        Promise.all(updatedCompanies)
          .then((companiesData) => {
            setCompanies(companiesData);
          })
          .catch((err) => console.error("Error fetching rates:", err));
      })
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  // 获取指定公司和楼层的报价
  const fetchRate = (name, floor) => {
    return fetch(`${API_BASE_URL}/?name=${name}&floor=${floor}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => (data.match ? data.rate.name : "Not Set"))
      .catch((err) => {
        console.error("Error fetching rate:", err);
        return "Not Set";
      });
  };

  // 删除公司
  const deleteCompany = (id) => {
    fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setCompanies(companies.filter((company) => company.id !== id));
      })
      .catch((err) => console.error("Error deleting company:", err));
  };

  // 检查公司名称是否已存在
  const checkCompanyExists = (name) => {
    const lowerCaseName = name.toLowerCase(); // 不区分大小写
    return companies.some(
      (company) => company.name.toLowerCase() === lowerCaseName
    );
  };

  // 添加公司
  const addCompany = () => {
    if (newCompanyName.trim() === "") {
      setError("Company name cannot be empty.");
      return;
    }
    if (checkCompanyExists(newCompanyName)) {
      setError("Company already exists. Please choose a different name.");
      return;
    }

    fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ name: newCompanyName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.company) {
          setCompanies((prevCompanies) => [...prevCompanies, data.company]); // ✅ 函数式更新
          setShowModal(false);
          setNewCompanyName("");
          setError("");
        } else {
          setError("Unexpected response from server.");
        }
      })

      .catch((err) => {
        console.error("Error adding company:", err);
        setError("An error occurred while adding the company.");
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header /> {/* 包含Header */}
      <main className="flex-1 relative p-6">
        {/* 背景图片 */}
        <img
          src="/images/background.jpg"
          alt="Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />

        <div className="relative z-10 bg-white bg-opacity-90 rounded-xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-center mb-6">
            Company Management
          </h1>

          {/* + Add Company 按钮 */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white text-2xl rounded-full w-10 h-10 absolute top-6 right-6 flex items-center justify-center hover:bg-blue-600">
            +
          </button>
          {/* 弹窗 */}
          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end">
                  <button
                    onClick={addCompany}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
                    Add Company
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <table className="min-w-full table-auto mt-12">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Company Name</th>
                <th className="py-2 px-4 text-left">1F Rate</th>
                <th className="py-2 px-4 text-left">2F Rate</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No companies available
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="border-b">
                    <td className="py-2 px-4">{company.name}</td>
                    <td className="py-2 px-4">{company.rate1F}</td>
                    <td className="py-2 px-4">{company.rate2F}</td>
                    <td className="py-2 px-4">
                      {/* - Delete 按钮 */}
                      <button
                        onClick={() => deleteCompany(company.id)}
                        className="ml-2 text-black hover:text-red-700 text-lg">
                        &minus; {/* 使用 &minus; 符号 */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer /> {/* 包含Footer */}
    </div>
  );
}

export default CompanyManagementPage;
