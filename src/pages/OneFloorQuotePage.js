import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // 导入 useLocation 用来获取 URL 查询参数
import Header from "../components/Header"; // 引入 Header 组件
import Footer from "../components/Footer"; // 引入 Footer 组件

function OneFloorQuotePage() {
  const location = useLocation(); // 获取当前的 location 对象
  const { company, rate } = location.state || {}; // 获取传递的 state 数据
  const { name, floor_rate, rental_rate, gable_rate } = rate || {}; // 解构提取需要的四个数据

  //蓝色部分的state
  const [address, setAddress] = useState("");
  const [perimeter, setPerimeter] = useState("");
  const [height, setHeight] = useState("");
  const [rateValue, setRateValue] = useState(floor_rate || "");
  const [edcBase, setEdcBase] = useState(0);
  const [travelCost, setTravelCost] = useState("N/A");
  const [overhang, setOverhang] = useState("");
  const [overhangPrice, setOverhangPrice] = useState(0);
  const [gableCount, setGableCount] = useState(0); // Gable 的数量
  const [gableRail, setGableRail] = useState(0); // GableRail 的值
  const [gablePlatform, setGablePlatform] = useState(0); // GablePlatform 的值
  //白色部分的state
  const [weeklyRental, setWeeklyRental] = useState(0);
  const [roofPitches, setRoofPitches] = useState("");
  const [raiseHeight, setRaiseHeight] = useState(""); // 平台升高的输入
  const [raisePlatformPrice, setRaisePlatformPrice] = useState(0); // 存储升跳板的价格
  const [edgeLength, setEdgeLength] = useState("");
  const [edgePrice, setEdgePrice] = useState(0);
  const [plywoodQuantity, setPlywoodQuantity] = useState(0);
  const [plywoodPrice, setPlywoodPrice] = useState(0);
  const [chimneySize, setChimneySize] = useState("");
  const [chimneyPrice, setChimneyPrice] = useState(0);
  const [chimneyRental, setChimneyRental] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullyPlanks, setFullyPlanks] = useState([
    { id: 1, name: "", area: "", price: 0, rentalPrice: 0 }, // 默认一个区域
  ]);
  const [topUp, setTopUp] = useState(0); // 存储 Top up 的价格
  const rentalNum = parseFloat(rental_rate); // 使用 rental_rate 计算

  // 计算 EDCtotal
  const calculateEDCtotal = () => {
    const edc = parseFloat(edcBase) || 0;
    const travel = parseFloat(travelCost) || 0;
    const overhang = parseFloat(overhangPrice) || 0;
    const rail = parseFloat(gableRail) || 0;
    const platform = parseFloat(gablePlatform) || 0;

    return edc + travel + overhang + rail + platform;
  };

  // 计算 fullyPlanks 总价格
  const calculateFullyPlanksPrice = () => {
    return fullyPlanks.reduce(
      (total, plank) => total + (parseFloat(plank.price) || 0),
      0
    );
  };

  // 计算 Alltotal
  const calculateAlltotal = () => {
    const EDCtotal = calculateEDCtotal();
    const fullyPlanksPrice = calculateFullyPlanksPrice();

    const raise = parseFloat(raisePlatformPrice) || 0;
    const edge = parseFloat(edgePrice) || 0;
    const ply = parseFloat(plywoodPrice) || 0;
    const chimney = parseFloat(chimneyPrice) || 0;
    const top = parseFloat(topUp) || 0;

    return EDCtotal + raise + edge + ply + chimney + fullyPlanksPrice + top;
  };

  // 计算
  useEffect(() => {
    const perimeterNum = parseFloat(perimeter);
    const heightNum = parseFloat(height);
    const rateNum = parseFloat(rateValue);

    // EDC Base 的计算
    if (!isNaN(perimeterNum) && !isNaN(heightNum) && !isNaN(rateNum)) {
      setEdcBase(perimeterNum * heightNum * rateNum);
    } else {
      setEdcBase(0);
    }

    // Weekly Rental 的计算
    if (!isNaN(perimeterNum) && !isNaN(heightNum) && !isNaN(rentalNum)) {
      // 计算 weekly rental
      let rental = perimeterNum * heightNum * rentalNum;

      // 四舍五入到最接近的 5
      rental = Math.round(rental / 5) * 5;

      setWeeklyRental(rental);
    } else {
      setWeeklyRental(0);
    }
  }, [perimeter, height, rateValue, rental_rate]); // 添加依赖项

  const isPremium = name && name.toLowerCase().includes("premium");

  const handleRoofPitchesChange = (e) => {
    setRoofPitches(e.target.value); // 更新字符串，用户输入的值
  };

  // Roof Pitch 的分离
  const calculateRoofPitches = () => {
    const pitches = roofPitches
      .split(",")
      .map((pitch) => parseFloat(pitch.trim()))
      .filter((pitch) => !isNaN(pitch));
    return pitches;
  };
  // 计算 GableRail 和 GablePlatform 的默认值
  useEffect(() => {
    const gableRailValue = gableCount * 50;
    setGableRail(gableRailValue);

    const pitches = roofPitches
      .split(",")
      .map((pitch) => parseFloat(pitch.trim()));
    const hasLargePitch = pitches.some((pitch) => pitch > 25);
    const gablePlatformValue = hasLargePitch ? gableCount * 50 : 0;
    setGablePlatform(gablePlatformValue);
  }, [gableCount, roofPitches]); // 当 gableCount 或 roofPitches 改变时重新计算

  const handleGableCountChange = (e) => {
    setGableCount(e.target.value);
  };

  const handleGableRailChange = (e) => {
    setGableRail(e.target.value);
  };

  const handleGablePlatformChange = (e) => {
    setGablePlatform(e.target.value);
  };

  //升跳板计算
  const calculateRaisePlatformCost = (height) => {
    const value = parseFloat(height);
    if (isNaN(value)) return 0;

    if (value < 60 || value > 80) {
      return value * 10; // 如果高度小于60或大于80，价格为高度*10
    } else {
      return 800; // 如果高度在60到80之间，价格为800
    }
  };

  const handleRaiseHeightChange = (e) => {
    const newHeight = e.target.value; // 获取用户输入的高度
    setRaiseHeight(newHeight); // 更新升跳板高度

    const price = calculateRaisePlatformCost(newHeight);
    setRaisePlatformPrice(price); // 更新升跳板价格
  };

  //Plywood 计算
  const handlePlywoodChange = (e) => {
    const newQuantity = e.target.value;
    setPlywoodQuantity(newQuantity);

    // Calculate price as quantity * 10
    const price = newQuantity * 10;
    setPlywoodPrice(price); // Update plywood price in state
  };

  // chimney 计算
  const handleChimneyChange = (e) => {
    const size = e.target.value.trim().toUpperCase(); // Make input case-insensitive
    setChimneySize(size);

    if (size === "0") {
      // If input is empty, set price and rental to 0
      setChimneyPrice(0);
      setChimneyRental(0);
      setErrorMessage(""); // Clear error message
      return;
    }

    // Define price and rental based on chimney size
    let price = 0;
    let rental = 0;
    if (size === "S") {
      price = 400;
      rental = 50;
    } else if (size === "M") {
      price = 600;
      rental = 60;
    } else if (size === "L") {
      price = 700;
      rental = 70;
    } else if (size === "XL") {
      price = 800;
      rental = 80;
    } else {
      setErrorMessage("Invalid input. Please enter S, M, L, XL, or 0.");
      setChimneyPrice(0);
      setChimneyRental(0);
      return;
    }

    // If valid size, update the state
    setChimneyPrice(price);
    setChimneyRental(rental);
    setErrorMessage(""); // Clear error message
  };

  // 处理区域名称变化
  const handlePlankNameChange = (index, e) => {
    const newPlanks = [...fullyPlanks];
    newPlanks[index].name = e.target.value;
    setFullyPlanks(newPlanks);
  };

  // 处理区域面积变化
  const handlePlankAreaChange = (index, e) => {
    const newPlanks = [...fullyPlanks];
    const area = parseFloat(e.target.value);

    if (!isNaN(area)) {
      // 计算价格
      newPlanks[index].area = area;
      newPlanks[index].price = (area / 1.2) * 1.5 * floor_rate;
      newPlanks[index].rentalPrice = (area / 1.2) * 1.5 * rental_rate;
    } else {
      newPlanks[index].area = "";
      newPlanks[index].price = 0;
      newPlanks[index].rentalPrice = 0;
    }

    setFullyPlanks(newPlanks);
  };

  // 添加新的区域
  const addPlank = () => {
    if (fullyPlanks.length < 4) {
      setFullyPlanks([
        ...fullyPlanks,
        {
          id: fullyPlanks.length + 1,
          name: "",
          area: "",
          price: 0,
          rentalPrice: 0,
        },
      ]);
    }
  };

  // 删除区域
  const removePlank = (index) => {
    const newPlanks = [...fullyPlanks];
    newPlanks.splice(index, 1);
    setFullyPlanks(newPlanks);
  };

  // topup 的计算
  const handleTopUpChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setTopUp(value); // 更新 Top up 的价格
    } else {
      setTopUp(0); // 如果输入无效，将价格设为 0
    }
  };

  useEffect(() => {
    // 使用 useEffect 来每次计算总价格
    const EDCtotal = calculateEDCtotal();
    const allTotal = calculateAlltotal();

    // 设置状态或其他计算逻辑，例如展示
    console.log("EDCtotal: ", EDCtotal);
    console.log("Alltotal: ", allTotal);
  }, [
    edcBase,
    travelCost,
    overhangPrice,
    gableRail,
    gablePlatform,
    raisePlatformPrice,
    edgePrice,
    plywoodPrice,
    chimneyPrice,
    fullyPlanks,
    topUp,
  ]);

  //debug
  useEffect(() => {
    const EDCtotal = calculateEDCtotal();
    const fullyPlanksPrice = calculateFullyPlanksPrice();
    const allTotal = calculateAlltotal();

    // 打印参与计算的各项数据
    console.log("=== 计算参数日志 ===");
    console.log("edcBase:", edcBase);
    console.log("travelCost:", travelCost);
    console.log("overhangPrice:", overhangPrice);
    console.log("gableRail:", gableRail);
    console.log("gablePlatform:", gablePlatform);
    console.log("raisePlatformPrice:", raisePlatformPrice);
    console.log("edgePrice:", edgePrice);
    console.log("plywoodPrice:", plywoodPrice);
    console.log("chimneyPrice:", chimneyPrice);
    console.log("fullyPlanksPrice:", fullyPlanksPrice);
    console.log("topUp:", topUp);
    console.log("EDCtotal:", EDCtotal);
    console.log("Alltotal:", allTotal);
    console.log("=====================");
  }, [
    edcBase,
    travelCost,
    overhangPrice,
    gableRail,
    gablePlatform,
    raisePlatformPrice,
    edgePrice,
    plywoodPrice,
    chimneyPrice,
    fullyPlanks,
    topUp,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-blue-300">
      <main className="flex-1 flex">
        {/* 左边区域：淡蓝色 */}
        <div className="w-1/2 bg-blue-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {company ? `${company} EDC Details` : "Input Details"}
          </h2>

          {/* 输入框区域 */}
          {/* Address 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              placeholder="Enter site address"
              value={address}
              onChange={(e) => {
                const value = e.target.value;
                setAddress(value);

                const lower = value.toLowerCase();
                if (lower.includes("halswell") || lower.includes("rolleston")) {
                  setTravelCost("130");
                } else if (value.trim() === "") {
                  setTravelCost("N/A");
                } else {
                  setTravelCost("150");
                }
              }}
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Perimeter 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Perimeter(m)</label>
            <input
              type="number"
              value={perimeter}
              onChange={(e) => setPerimeter(e.target.value)}
              placeholder="Enter Perimeter"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Height 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Height(m)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter Height"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Rate 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Rate($)</label>
            <input
              type="number"
              value={rateValue}
              placeholder="Enter Rate"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">EDC-BASE:${edcBase} </span>
          </div>

          {/* Travel 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Travel($)</label>
            <input
              type="text"
              value={travelCost}
              onChange={(e) => setTravelCost(e.target.value)} // 用户可手动覆盖
              className="w-full px-3 py-2 border  bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Overhang 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Overhang(sqm)</label>
            <input
              type="number"
              placeholder="Enter Overhang"
              value={overhang}
              onChange={(e) => {
                const value = e.target.value;
                setOverhang(value);

                // 计算 overhang 金额（如果有输入）
                if (value) {
                  const price =
                    (parseFloat(value) / 1.2) * 1.5 * (floor_rate || 0);
                  setOverhangPrice(parseFloat(price.toFixed(2)));
                } else {
                  setOverhangPrice(0);
                }
              }}
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">Overhang: ${overhangPrice}</span>
          </div>

          {/* Gable 输入部分 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Gables(n)</label>
            <input
              type="number"
              value={gableCount}
              onChange={handleGableCountChange} // 更新 Gable 数量
              placeholder="Enter Gable Count"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div>
              <label className="block text-gray-700 mb-2">GableRail: $</label>
              <input
                type="number"
                value={gableRail}
                onChange={handleGableRailChange} // 手动修改 GableRail
                className="w-full px-3 py-2 border bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <br />
              <label className="block text-gray-700 mb-2">
                GablePlatform: $
              </label>
              <input
                type="number"
                value={gablePlatform}
                onChange={handleGablePlatformChange} // 手动修改 GablePlatform
                className="w-full px-3 py-2 border  bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Note 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Note</label>
            <textarea
              placeholder="Enter Note"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
          </div>
        </div>

        {/* 右边区域：白色 */}
        <div className="w-1/2 p-6" style={{ backgroundColor: "#FAF9F6" }}>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add on Details
          </h2>

          {/* Weekly Rental 输入框*/}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Weekly Rental</label>
            <input
              type="text"
              value={weeklyRental.toFixed(2)}
              disabled
              className="w-full px-3 py-2 bg-gray-300 border rounded mb-2"
            />
            <span className="text-gray-500">
              Weekly Rental: ${weeklyRental.toFixed(2)}
              {isPremium && " (include 4 weeks rental)"}
            </span>
          </div>

          {/* Roof Pitch 输入框*/}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Roof Pitch（°）</label>
            <input
              type="text"
              value={roofPitches}
              onChange={handleRoofPitchesChange} // 更新 input 值
              placeholder="Enter Roof Pitches separated by commas"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Roof Pitches:
              {calculateRoofPitches().map((pitch, index) => (
                <li key={index}>
                  Pitch {index + 1}: {pitch}°
                </li>
              ))}{" "}
            </span>
          </div>

          {/* Raise the platform 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Raise the platform (m)
            </label>
            <input
              type="number"
              value={raiseHeight} // 绑定输入框值
              onChange={handleRaiseHeightChange} // 计算价格并更新 state
              placeholder="Enter Raise the platform"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Raise Platform: ${raisePlatformPrice} {/* 显示计算出来的价格 */}
            </span>
          </div>

          {/* Edge Protection 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Edge Protection(m)
            </label>
            <input
              type="number"
              placeholder="Enter Edge Protection"
              value={edgeLength}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setEdgeLength(e.target.value);
                if (!isNaN(value)) {
                  setEdgePrice(value * 20);
                } else {
                  setEdgePrice(0);
                }
              }}
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Edge Protection: ${edgePrice.toFixed(2)}
            </span>
          </div>

          {/* Plywood 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Plywood</label>
            <input
              type="number"
              value={plywoodQuantity} // Bind input to plywood quantity state
              onChange={handlePlywoodChange} // Update quantity and price
              placeholder="Enter Plywood"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Plywood: ${plywoodPrice} {/* Display calculated price */}
            </span>
          </div>

          {/* Chimney 输入框*/}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Chimney (S, M, L, XL)
            </label>
            <input
              type="text"
              value={chimneySize}
              onChange={handleChimneyChange} // Handle input change
              placeholder="Enter Chimney size"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}{" "}
            {/* Show error message */}
            <div className="mt-2">
              <span className="text-gray-500">Chimney: ${chimneyPrice}</span>
              <br />
              <span className="text-gray-500">Rental: ${chimneyRental}</span>
            </div>
          </div>

          {/* Fully Planks 输入框 */}
          <div className="mb-6">
            <h2 className="block text-gray-700 mb-2">Fully Planks</h2>
            {fullyPlanks.map((plank, index) => (
              <div
                key={plank.id}
                className="plank mb-4 p-4 border rounded-lg shadow-md">
                <input
                  type="text"
                  value={plank.name}
                  onChange={(e) => handlePlankNameChange(index, e)}
                  placeholder="Enter Name"
                  className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  value={plank.area}
                  onChange={(e) => handlePlankAreaChange(index, e)}
                  placeholder="Enter Area (sqm)"
                  className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="mb-2">
                  <span className="text-gray-500">
                    Price: ${plank.price.toFixed(2)}
                  </span>
                  <span className="ml-4 text-gray-500">
                    Rental: ${plank.rentalPrice.toFixed(2)}
                  </span>
                </div>
                {fullyPlanks.length > 1 && (
                  <button
                    onClick={() => removePlank(index)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                    Remove
                  </button>
                )}
              </div>
            ))}
            {fullyPlanks.length < 4 && (
              <button
                onClick={addPlank}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Add Plank
              </button>
            )}
          </div>

          {/* Top up 输入框*/}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Top up</label>
            <input
              type="number"
              value={topUp}
              onChange={handleTopUpChange} // 更新 Top up 价格
              placeholder="Enter Top up"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">Top up: ${topUp.toFixed(2)}</span>
          </div>

          {/* Total 输入框*/}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                EDC Total: ${calculateEDCtotal()}
              </h3>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                All Total: ${calculateAlltotal()}
              </h3>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OneFloorQuotePage;
