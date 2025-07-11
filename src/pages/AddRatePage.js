import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AddRatePage() {
  const [form, setForm] = useState({
    name: "",
    floor_rate: "",
    rental_rate: "",
    gable_rate: "",
    ground_floor_rate: "",
    ground_floor_rental_rate: "",
    first_floor_rate: "",
    first_floor_rental_rate: "",
    type: "", // "1f" or "2f"
  });

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal 是否显示
  const [modalMessage, setModalMessage] = useState(""); // Modal 的信息
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const checkIfRateExists = () => {
    const rateName = `${form.name.trim()}-${form.type.toUpperCase()}`;

    return fetch(`${API_BASE_URL}/checkRateExists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ name: rateName }), // 发送请求检查名字是否存在
    })
      .then((res) => res.json())
      .then((data) => {
        return data.exists; // 后端返回的 exists 字段，true 表示存在
      })
      .catch((err) => {
        console.error("Error checking rate:", err);
        return false; // 如果发生错误，假设名字是不存在的
      });
  };

  const handleSubmit = async () => {
    const payload = { ...form };

    // 自动识别类型并更新名字
    if (!form.type) {
      setMessage("Please select 1F or 2F");
      return;
    }

    payload.name = `${form.name.trim()}-${form.type.toUpperCase()}`; // 组合 name

    // 检查是否存在重复名字
    const rateExists = await checkIfRateExists();
    if (rateExists) {
      setModalMessage(
        "This rate name already exists. Please choose a different name."
      );
      setShowModal(true);
      return;
    }

    fetch(`${API_BASE_URL}/createRate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create rate");
        return res.json();
      })
      .then((data) => {
        setMessage("Rate created successfully!");
        setTimeout(() => {
          navigate("/quote/rate-management");
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error creating rate");
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
        <div className="relative z-10 bg-white bg-opacity-90 rounded-xl shadow-lg p-10 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Add New Rate
          </h2>

          {message && (
            <div className="mb-4 text-center text-green-600">{message}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {/* 选择 1F 或 2F */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Select Floor Type
              </label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="floorType"
                    value="1f"
                    checked={form.type === "1f"}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="mr-2"
                  />
                  1F
                </label>
                <label>
                  <input
                    type="radio"
                    name="floorType"
                    value="2f"
                    checked={form.type === "2f"}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="mr-2"
                  />
                  2F
                </label>
              </div>
            </div>

            {/* 根据类型显示字段 */}
            {form.type === "1f" && (
              <>
                <InputField
                  label="Floor Rate"
                  name="floor_rate"
                  value={form.floor_rate}
                  onChange={handleChange}
                />
                <InputField
                  label="Rental Rate"
                  name="rental_rate"
                  value={form.rental_rate}
                  onChange={handleChange}
                />
                <InputField
                  label="Gable Rate"
                  name="gable_rate"
                  value={form.gable_rate}
                  onChange={handleChange}
                />
              </>
            )}

            {form.type === "2f" && (
              <>
                <InputField
                  label="Ground Floor Rate"
                  name="ground_floor_rate"
                  value={form.ground_floor_rate}
                  onChange={handleChange}
                />
                <InputField
                  label="Ground Floor Rental Rate"
                  name="ground_floor_rental_rate"
                  value={form.ground_floor_rental_rate}
                  onChange={handleChange}
                />
                <InputField
                  label="First Floor Rate"
                  name="first_floor_rate"
                  value={form.first_floor_rate}
                  onChange={handleChange}
                />
                <InputField
                  label="First Floor Rental Rate"
                  name="first_floor_rental_rate"
                  value={form.first_floor_rental_rate}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block mx-auto">
            Create Rate
          </button>
        </div>

        {/* Modal 弹窗 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
              <p className="text-lg text-gray-800 mb-4">{modalMessage}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowModal(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// 通用输入组件
function InputField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        className="w-full border p-2 rounded"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

export default AddRatePage;
