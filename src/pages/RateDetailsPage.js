import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function RateDetailsPage() {
  const { rateId } = useParams();
  const [rate, setRate] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [floorType, setFloorType] = useState("1F");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [companiesInRate, setCompaniesInRate] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 获取rate的价格内容
  useEffect(() => {
    fetch(`${API_BASE_URL}/rate/${rateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRate(data);
        setForm(data);

        if (data.name.toLowerCase().includes("1f")) {
          setFloorType("1F");
        } else if (data.name.toLowerCase().includes("2f")) {
          setFloorType("2F");
        }
      })
      .catch((err) => console.error("Failed to load rate", err))
      .finally(() => setLoading(false));
  }, [rateId]);

  // 获取所有公司用于添加
  useEffect(() => {
    fetch(`${API_BASE_URL}/companies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies))
      .catch((err) => console.error("Failed to load companies", err));
  }, []);

  //获取rate下绑定的公司
  useEffect(() => {
    fetch(`${API_BASE_URL}/rate/${rateId}/companies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCompaniesInRate(data.companies))
      .catch((err) =>
        console.error("Failed to load companies for this rate", err)
      );
  }, [rateId]);

  //编辑和保存 Rate 内容
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    fetch(`${API_BASE_URL}/rate/${rateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage("Rate updated successfully!");
        setIsEditing(false);
        setRate(form);
      })
      .catch(() => setMessage("Update failed."));
  };

  //删除公司和rate的绑定（确认 + 发送请求）
  const handleUnmapCompany = (companyId) => {
    const company = companiesInRate.find((company) => company.id === companyId);

    if (company) {
      setCompanyToDelete(company);
      setShowDeleteModal(true);
    } else {
      console.error("Company not found to delete");
    }
  };

  const confirmDelete = () => {
    console.log("Deleting company:", companyToDelete);

    // 调用后端删除接口
    fetch(`${API_BASE_URL}/unmapRate`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ companyId: companyToDelete.id, floorType }), // 删除的公司ID和楼层类型
    })
      .then((res) => {
        console.log("Delete response:", res);
        if (res.ok) {
          setCompaniesInRate((prev) =>
            prev.filter((company) => company.id !== companyToDelete.id)
          );
          setMessage("Company unmapped successfully!");
          setShowDeleteModal(false);
        } else {
          res.json().then((error) => {
            console.error("Error response:", error);
            setMessage("Failed to unmap company.");
          });
        }
      })
      .catch((err) => {
        console.error("Error deleting company:", err);
        setMessage("Failed to unmap company.");
      });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  //添加公司到当前 rate的绑定
  const handleMapCompany = () => {
    if (!selectedCompanyId) return;

    fetch(
      `${API_BASE_URL}/checkMapping?companyId=${selectedCompanyId}&floorType=${floorType}&rateId=${rateId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          setModalMessage(
            "This company is already added to another rate under the same floor."
          );
          setShowModal(true);
          return;
        }

        fetch(`${API_BASE_URL}/mapRate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            companyId: parseInt(selectedCompanyId),
            floorType,
            rateId: parseInt(rateId),
          }),
        })
          .then((res) => res.json())
          .then(() => {
            setMessage("Company mapped to this rate!");
            setSelectedCompanyId("");
            setFloorType("1F");

            fetch(`${API_BASE_URL}/rate/${rateId}/companies`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            })
              .then((res) => res.json())
              .then((data) => setCompaniesInRate(data.companies));
          })
          .catch(() => setMessage("Mapping failed."));
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 relative p-6">
        <img
          src="/images/background.jpg"
          alt="Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="relative z-10 bg-white bg-opacity-90 rounded-xl shadow-lg p-12 w-full max-w-4xl mx-auto min-h-screen">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Rate Details - ID #{rateId}
          </h2>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {message && (
                <div className="mb-4 text-center text-green-600">{message}</div>
              )}

              {rate ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Name (readonly):{" "}
                    </label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={form.name || ""}
                      readOnly // 设置只读，不能编辑
                    />
                  </div>

                  {/* 显示字段，如果有值才渲染 */}
                  {Object.entries(form)
                    .filter(([key]) => {
                      const lowerName = form.name?.toLowerCase() || "";
                      if (lowerName.includes("1f")) {
                        return [
                          "id",

                          "floor_rate",
                          "rental_rate",
                          "gable_rate",
                        ].includes(key);
                      }
                      if (lowerName.includes("2f")) {
                        return [
                          "id",

                          "ground_floor_rate",
                          "ground_floor_rental_rate",
                          "first_floor_rate",
                          "first_floor_rental_rate",
                        ].includes(key);
                      }
                      // 默认：不显示任何字段（防止异常情况）
                      return false;
                    })
                    .map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm text-gray-600 mb-1">
                          {key.replace(/_/g, " ")}:
                        </label>
                        <input
                          type="text"
                          className="w-full border p-2 rounded"
                          value={value || ""}
                          disabled={key === "id" || !isEditing}
                          onChange={(e) => handleChange(key, e.target.value)}
                        />
                      </div>
                    ))}

                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Edit
                    </button>
                  )}

                  <hr className="my-6" />

                  {/* 添加公司 */}
                  <h3 className="text-xl font-semibold mb-2">
                    Add Company to this Rate
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="border p-2 rounded"
                      value={selectedCompanyId}
                      onChange={(e) => setSelectedCompanyId(e.target.value)}>
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>

                    <input
                      className="border p-2 rounded bg-gray-100 text-gray-700 cursor-default"
                      value={floorType}
                      readOnly
                    />

                    <button
                      onClick={handleMapCompany}
                      className="col-span-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                      Add Company to Rate
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Companies Under this Rate
                    </h3>
                    {companiesInRate && companiesInRate.length > 0 ? (
                      <ul className="space-y-2">
                        {companiesInRate.map((company) => (
                          <li
                            key={company.id}
                            className="flex justify-between items-center">
                            <span>{company.name}</span>
                            <button
                              className="text-red-600 hover:underline text-sm"
                              onClick={() => handleUnmapCompany(company.id)}>
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No companies mapped to this rate.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-red-500 text-center">Rate not found.</p>
              )}
            </>
          )}
        </div>

        {/* 弹框部分 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <p className="text-gray-800 mb-4">{modalMessage}</p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                OK
              </button>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <p className="text-gray-800 mb-4">
                Are you sure you want to remove{" "}
                <strong>{companyToDelete?.name}</strong> from this rate?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default RateDetailsPage;
