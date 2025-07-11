import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function RateManagementPage() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rateToDelete, setRateToDelete] = useState(null);

  const navigate = useNavigate();

  // 获取所有 rate 数据
  useEffect(() => {
    fetch(`${API_BASE_URL}/allRates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch rates");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Rates fetched:", data.allRates);
        setRates(data.allRates);
      })
      .catch((err) => {
        console.error("Failed to fetch rates:", err);
        setError("Unable to load rates. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // 点击跳转到详情页面
  const handleRateClick = (rateId) => {
    navigate(`/quote/rate/${rateId}`);
  };

  // 点击跳转到添加新 rate 页面
  const handleAddRate = () => {
    navigate("/quote/add-rate");
  };

  //点击删除函数和确认函数弹框
  const handleDeleteClick = (rate) => {
    setRateToDelete(rate);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!rateToDelete) return;

    fetch(`${API_BASE_URL}/rate/${rateToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete rate");
        }
        // 删除成功，从 UI 中移除
        setRates((prevRates) =>
          prevRates.filter((r) => r.id !== rateToDelete.id)
        );
        setShowDeleteModal(false);
        setRateToDelete(null);
      })
      .catch((err) => {
        console.error("Error deleting rate:", err);
        setShowDeleteModal(false);
        setRateToDelete(null);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-1 relative p-6">
        {/* 背景图片 */}
        <img
          src="/images/background.jpg"
          alt="Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />

        {/* 白色框 */}
        <div className="relative z-10 bg-white bg-opacity-90 rounded-xl shadow-lg p-12 w-full max-w-4xl mx-auto min-h-screen">
          {/* +号按钮 */}
          <button
            onClick={handleAddRate}
            className="absolute top-6 right-6 bg-blue-500 hover:bg-blue-600 text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
            +
          </button>

          <h2 className="text-2xl font-semibold text-center mb-6">
            Rate Management
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* 左列 - 1F */}
            <div className="space-y-4">
              {rates
                .filter((rate) => rate.name?.toLowerCase().includes("1f"))
                .map((rate) => (
                  <div
                    key={rate.id}
                    className="flex items-center justify-between">
                    <div className="flex items-center w-full">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3" />
                      <button
                        onClick={() => handleRateClick(rate.id)}
                        className="bg-white shadow-md px-4 py-1 rounded-xl hover:bg-blue-50 transition w-full text-left text-sm">
                        {rate.name.trim()}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(rate)}
                      className="ml-2 text-black hover:text-red-700 text-lg">
                      &minus;
                    </button>
                  </div>
                ))}
            </div>

            {/* 右列 - 2F */}
            <div className="space-y-4">
              {rates
                .filter((rate) => rate.name?.toLowerCase().includes("2f"))
                .map((rate) => (
                  <div
                    key={rate.id}
                    className="flex items-center justify-between">
                    <div className="flex items-center w-full">
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-3" />
                      <button
                        onClick={() => handleRateClick(rate.id)}
                        className="bg-white shadow-md px-4 py-1 rounded-xl hover:bg-blue-50 transition w-full text-left text-sm">
                        {rate.name.trim()}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(rate)}
                      className="ml-2 text-black-500 hover:text-red-700 text-lg">
                      &minus;
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-gray-800 mb-4">
              Are you sure you want to delete{" "}
              <strong>{rateToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRateToDelete(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default RateManagementPage;
