import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

function TwoFloorQuotePage() {
  const location = useLocation();
  const { company, rate } = location.state || {};
  const {
    name,
    ground_floor_rate,
    ground_floor_rental_rate,
    first_floor_rate,
    first_floor_rental_rate,
  } = rate || {};
  const isPremium = name && name.toLowerCase().includes("premium");

  //*****所有state*/
  //蓝色部分的const use state
  const [address, setAddress] = useState("");
  const [groundFloorPerimeter, setGroundFloorPerimeter] = useState("");
  const [upperFloorPerimeter, setUpperFloorPerimeter] = useState("");
  const [groundFloorHeight, setGroundFloorHeight] = useState("");
  const [upperFloorHeight, setUpperFloorHeight] = useState("");
  const [groundFloorEdcBase, setGroundFloorEdcBase] = useState(0);
  const [firstFloorEdcBase, setFirstFloorEdcBase] = useState(0);
  const [travelCost, setTravelCost] = useState("N/A");
  const [groundFloorOverhang, setGroundFloorOverhang] = useState("");
  const [upperFloorOverhang, setUpperFloorOverhang] = useState("");
  const [groundFloorOverhangPrice, setGroundFloorOverhangPrice] = useState(0);
  const [upperFloorOverhangPrice, setUpperFloorOverhangPrice] = useState(0);
  const [gableCount, setGableCount] = useState(0); // Gable 的数量
  const [gableRail, setGableRail] = useState(0); // GableRail 的值
  const [gablePlatform, setGablePlatform] = useState(0); // GablePlatform 的值
  const [lowerRoof, setLowerRoof] = useState(""); // 用户输入的 Lower Roof 面积
  const [lowerRoofPrice, setLowerRoofPrice] = useState(0); // 自动计算出的价格

  //白色部分的const use state
  const [groundWeeklyRental, setGroundWeeklyRental] = useState(0);
  const [upperWeeklyRental, setUpperWeeklyRental] = useState(0);
  const [roofPitches, setRoofPitches] = useState("");
  const [raiseHeight, setRaiseHeight] = useState("");
  const [raisePlatformPrice, setRaisePlatformPrice] = useState(0);
  const [edgeLength, setEdgeLength] = useState(""); // 存储 Edge Protection 输入值
  const [edgePrice, setEdgePrice] = useState(0); // 存储 Edge Protection 的价格
  const [plywoodQuantity, setPlywoodQuantity] = useState(0); // 存储 Plywood 数量
  const [plywoodPrice, setPlywoodPrice] = useState(0); // 存储 Plywood 的价格
  const [chimneySize, setChimneySize] = useState(""); // 存储 Chimney 尺寸
  const [chimneyPrice, setChimneyPrice] = useState(0); // 存储 Chimney 价格
  const [chimneyRental, setChimneyRental] = useState(0); // 存储 Chimney 租金
  const [errorMessage, setErrorMessage] = useState(""); // 错误信息
  const [fullyPlanks, setFullyPlanks] = useState([
    { id: 1, name: "", area: "", price: 0, rentalPrice: 0 }, // 默认一个区域
  ]);
  const [topUp, setTopUp] = useState(0); // 存储 Top up 的价格

  //**** 普通计算函数 */
  //Roof Pitch函数： 分离 Roof Pitches（返回数字数组）
  // Round 到最接近的 5
  const roundToNearestFive = (num) => {
    return Math.round(num / 5) * 5;
  };

  const calculateRoofPitches = () => {
    return roofPitches
      .split(",")
      .map((pitch) => parseFloat(pitch.trim()))
      .filter((pitch) => !isNaN(pitch));
  };

  // Raise the platform 函数：升跳板价格计算函数
  const calculateRaisePlatformCost = (height) => {
    const value = parseFloat(height);
    if (isNaN(value)) return 0;

    if (value < 60 || value > 80) {
      return value * 10; // 高度小于60或大于80 -> 高度 * 10
    } else {
      return 800; // 高度在 60 - 80 之间 -> 固定800
    }
  };

  // Edge Protection函数： 价格计算逻辑
  const calculateEdgeProtectionPrice = (length) => {
    const value = parseFloat(length);
    if (isNaN(value)) return 0;

    if (value <= 50) {
      return value * 20; // 50m 或以下，每米 $20
    } else if (value <= 70) {
      return value * 15; // 51-70m，每米 $15
    } else {
      return value * 13; // 70m 以上，每米 $13
    }
  };

  // Plywood函数： 价格
  const handlePlywoodChange = (e) => {
    const newQuantity = e.target.value;
    setPlywoodQuantity(newQuantity);

    // 价格计算: 数量 * 10
    const price = newQuantity * 10;
    setPlywoodPrice(price); // 更新价格
  };

  // Chimney函数：计算函数
  const handleChimneyChange = (e) => {
    const size = e.target.value.trim().toUpperCase(); // 将输入转换为大写
    setChimneySize(size);

    if (size === "0") {
      // 如果输入是 0，清除价格和租金
      setChimneyPrice(0);
      setChimneyRental(0);
      setErrorMessage(""); // 清除错误信息
      return;
    }

    // 定义不同尺寸对应的价格和租金
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
      // 输入无效时，显示错误信息
      setErrorMessage("Invalid input. Please enter S, M, L, XL, or 0.");
      setChimneyPrice(0);
      setChimneyRental(0);
      return;
    }

    // 如果输入有效，更新状态
    setChimneyPrice(price);
    setChimneyRental(rental);
    setErrorMessage(""); // 清除错误信息
  };

  // 💡 Fully Planks 总价计算函数
  const calculateFullyPlanksPrice = () => {
    return fullyPlanks.reduce(
      (total, plank) => total + (parseFloat(plank.price) || 0),
      0
    );
  };

  // 计算EDCtotal
  const calculateGroundEDCtotal = () => {
    const edc = parseFloat(groundFloorEdcBase) || 0;
    const overhang = parseFloat(groundFloorOverhangPrice) || 0;
    const rail = parseFloat(gableRail) || 0;
    const travel = parseFloat(travelCost) || 0;
    return roundToNearestFive(edc + overhang + rail + travel);
  };

  const calculateUpperEDCtotal = () => {
    const edc = parseFloat(firstFloorEdcBase) || 0;
    const overhang = parseFloat(upperFloorOverhangPrice) || 0;
    const platform = parseFloat(gablePlatform) || 0;
    const travel = parseFloat(travelCost) || 0;
    const lowerRoof = parseFloat(lowerRoofPrice) || 0;
    return roundToNearestFive(edc + overhang + platform + travel + lowerRoof);
  };

  // 计算alltotal
  const calculateAlltotal = () => {
    const groundEDC = calculateGroundEDCtotal();
    const upperEDC = calculateUpperEDCtotal();
    const fullyPlanksPrice = calculateFullyPlanksPrice();

    const raise = parseFloat(raisePlatformPrice) || 0;
    const edge = parseFloat(edgePrice) || 0;
    const ply = parseFloat(plywoodPrice) || 0;
    const chimney = parseFloat(chimneyPrice) || 0;
    const top = parseFloat(topUp) || 0;

    const total =
      groundEDC +
      upperEDC +
      raise +
      edge +
      ply +
      chimney +
      fullyPlanksPrice +
      top;

    return roundToNearestFive(total);
  };

  //***所有handers 交互处理函数 */
  //gable 处理输入变化
  const handleGableCountChange = (e) => {
    setGableCount(e.target.value);
  };

  const handleGableRailChange = (e) => {
    setGableRail(e.target.value);
  };

  const handleGablePlatformChange = (e) => {
    setGablePlatform(e.target.value);
  };
  //  Roof 处理输入变化
  const handleRoofPitchesChange = (e) => {
    setRoofPitches(e.target.value);
  };

  // Raise platform 输入变化处理
  const handleRaiseHeightChange = (e) => {
    const newHeight = e.target.value;
    setRaiseHeight(newHeight);

    const price = calculateRaisePlatformCost(newHeight);
    setRaisePlatformPrice(price);
  };

  // fully planks 处理区域名称变化
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
      const rawPrice = (area / 1.2) * 1.5 * 16.6;
      const rawRental = (area / 1.2) * 1.5 * ground_floor_rental_rate;
      newPlanks[index].price = roundToNearestFive(rawPrice);
      newPlanks[index].rentalPrice = roundToNearestFive(rawRental);
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

  // topup处理变化
  const handleTopUpChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setTopUp(value); // 更新 Top up 的价格
    } else {
      setTopUp(0); // 如果输入无效，设为 0
    }
  };

  //***Useffect计算*/
  //1. 计算 Ground Floor 和 First Floor 的 EDC Base
  useEffect(() => {
    const groundPerimeterNum = parseFloat(groundFloorPerimeter);
    const groundHeightNum = parseFloat(groundFloorHeight);
    const firstPerimeterNum = parseFloat(upperFloorPerimeter);
    const firstHeightNum = parseFloat(upperFloorHeight);
    const groundRateNum = parseFloat(ground_floor_rate);
    const firstRateNum = parseFloat(first_floor_rate);

    // 计算 ground Floor EDC Base
    if (
      !isNaN(groundPerimeterNum) &&
      !isNaN(groundHeightNum) &&
      !isNaN(groundRateNum)
    ) {
      const value = groundPerimeterNum * groundHeightNum * groundRateNum;
      setGroundFloorEdcBase(roundToNearestFive(value));
    } else {
      setGroundFloorEdcBase(0);
    }

    // 计算 First Floor EDC Base
    if (
      !isNaN(firstPerimeterNum) &&
      !isNaN(firstHeightNum) &&
      !isNaN(firstRateNum)
    ) {
      const value = firstPerimeterNum * firstHeightNum * firstRateNum;
      setFirstFloorEdcBase(roundToNearestFive(value));
    } else {
      setFirstFloorEdcBase(0);
    }
  }, [
    groundFloorPerimeter,
    groundFloorHeight,
    upperFloorPerimeter,
    upperFloorHeight,
    ground_floor_rate,
    first_floor_rate,
  ]);

  // 2. 计算 Overhang 价格
  useEffect(() => {
    if (groundFloorOverhang) {
      const groundPrice =
        (parseFloat(groundFloorOverhang) / 1.2) * 1.5 * (14.85 || 0);
      setGroundFloorOverhangPrice(parseFloat(groundPrice.toFixed(2)));
    } else {
      setGroundFloorOverhangPrice(0);
    }

    // Upper Floor Overhang 计算
    if (upperFloorOverhang) {
      const upperPrice =
        (parseFloat(upperFloorOverhang) / 1.2) * 1.25 * (16.6 || 0);
      setUpperFloorOverhangPrice(parseFloat(upperPrice.toFixed(2)));
    } else {
      setUpperFloorOverhangPrice(0);
    }
  }, [
    groundFloorOverhang,
    upperFloorOverhang,
    ground_floor_rate,
    first_floor_rate,
  ]);

  //3. 计算Gablerail和Gable platform
  useEffect(() => {
    const gableRailValue = gableCount * 50;
    setGableRail(gableRailValue);

    const pitches = roofPitches
      .split(",")
      .map((pitch) => parseFloat(pitch.trim()));
    const hasLargePitch = pitches.some((pitch) => pitch > 25);
    const gablePlatformValue = hasLargePitch ? gableCount * 50 : 0;
    setGablePlatform(gablePlatformValue);
  }, [gableCount, roofPitches]);

  //4. 计算lowerroof费用
  useEffect(() => {
    if (lowerRoof) {
      const price = parseFloat(lowerRoof) * 6.4;
      setLowerRoofPrice(parseFloat(price.toFixed(2)));
    } else {
      setLowerRoofPrice(0);
    }
  }, [lowerRoof]);

  //5. 计算Weekly rental
  useEffect(() => {
    const gPerimeter = parseFloat(groundFloorPerimeter);
    const gHeight = parseFloat(groundFloorHeight);
    const gRentalRate = parseFloat(ground_floor_rental_rate);

    const uPerimeter = parseFloat(upperFloorPerimeter);
    const uHeight = parseFloat(upperFloorHeight);
    const uRentalRate = parseFloat(first_floor_rental_rate);

    if (!isNaN(gPerimeter) && !isNaN(gHeight) && !isNaN(gRentalRate)) {
      let groundRental = gPerimeter * gHeight * gRentalRate;
      groundRental = Math.round(groundRental / 5) * 5;
      setGroundWeeklyRental(groundRental);
    } else {
      setGroundWeeklyRental(0);
    }

    if (!isNaN(uPerimeter) && !isNaN(uHeight) && !isNaN(uRentalRate)) {
      let upperRental = uPerimeter * uHeight * uRentalRate;
      upperRental = Math.round(upperRental / 5) * 5;
      setUpperWeeklyRental(upperRental);
    } else {
      setUpperWeeklyRental(0);
    }
  }, [
    groundFloorPerimeter,
    groundFloorHeight,
    ground_floor_rental_rate,
    upperFloorPerimeter,
    upperFloorHeight,
    first_floor_rental_rate,
  ]);

  //6.计算总数
  useEffect(() => {
    const ground = calculateGroundEDCtotal();
    const upper = calculateUpperEDCtotal();
    const all = calculateAlltotal();

    console.log("Ground EDC Total:", ground);
    console.log("Upper EDC Total:", upper);
    console.log("All Total:", all);
  }, [
    groundFloorEdcBase,
    firstFloorEdcBase,
    travelCost,
    groundFloorOverhangPrice,
    upperFloorOverhangPrice,
    gableRail,
    gablePlatform,
    raisePlatformPrice,
    edgePrice,
    plywoodPrice,
    chimneyPrice,
    lowerRoofPrice,
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

          {/* Perimeter 输入框区域：一楼 + 二楼并排 */}
          <div className="mb-6 flex gap-4">
            {/* Ground Floor Perimeter */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Ground Floor Perimeter (m)
              </label>
              <input
                type="number"
                value={groundFloorPerimeter}
                onChange={(e) => setGroundFloorPerimeter(e.target.value)}
                placeholder="Ground Floor"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {/* Upper Floor Perimeter */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Upper Floor Perimeter (m)
              </label>
              <input
                type="number"
                value={upperFloorPerimeter}
                onChange={(e) => setUpperFloorPerimeter(e.target.value)}
                placeholder="Upper Floor"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Height 输入框区域：一楼 + 二楼并排 */}
          <div className="mb-6 flex gap-4">
            {/* Ground Floor Height */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Ground Floor Height (m)
              </label>
              <input
                type="number"
                value={groundFloorHeight}
                onChange={(e) => setGroundFloorHeight(e.target.value)}
                placeholder="Ground Floor"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {/* Upper Floor Height */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Upper Floor Height (m)
              </label>
              <input
                type="number"
                value={upperFloorHeight}
                onChange={(e) => setUpperFloorHeight(e.target.value)}
                placeholder="Upper Floor"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Rate 显示部分 */}
          <div className="mb-6 flex gap-4">
            {/* Ground Floor Rate */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Ground Floor Rate ($)
              </label>
              <input
                type="number"
                value={ground_floor_rate || ""}
                disabled
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <span className="text-gray-500">
                GF EDC-BASE: ${groundFloorEdcBase.toFixed(2)}
              </span>
            </div>

            {/* First Floor Rate */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Upper Floor Rate ($)
              </label>
              <input
                type="number"
                value={first_floor_rate || ""}
                disabled
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <span className="text-gray-500">
                FF EDC-BASE: ${firstFloorEdcBase.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Travel 输入框部分 */}
          <div className="mb-6 flex gap-4">
            {/* Ground Floor Travel Cost */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Ground Floor Travel ($)
              </label>
              <input
                type="text"
                value={travelCost}
                onChange={(e) => setTravelCost(e.target.value)} // 用户可手动覆盖
                className="w-full px-3 py-2 border bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {/* First Floor Travel Cost */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                First Floor Travel ($)
              </label>
              <input
                type="text"
                value={travelCost}
                onChange={(e) => setTravelCost(e.target.value)} // 用户可手动覆盖
                className="w-full px-3 py-2 border bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/*  Overhang */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Ground Floor Overhang (sqm)
              </label>
              <input
                type="number"
                value={groundFloorOverhang}
                onChange={(e) => setGroundFloorOverhang(e.target.value)}
                placeholder="Enter Ground Floor Overhang"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <span className="text-gray-500">
                GF Overhang: ${groundFloorOverhangPrice}
              </span>
            </div>

            {/* Upper Floor Overhang */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Upper Floor Overhang (sqm)
              </label>
              <input
                type="number"
                value={upperFloorOverhang}
                onChange={(e) => setUpperFloorOverhang(e.target.value)}
                placeholder="Enter Upper Floor Overhang"
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <span className="text-gray-500">
                FF Overhang: ${upperFloorOverhangPrice}
              </span>
            </div>
          </div>

          {/* Gable 输入部分 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Gables (n)</label>
            <input
              type="number"
              value={gableCount}
              onChange={handleGableCountChange}
              placeholder="Enter Gable Count"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div>
              <label className="block text-gray-700 mb-2">GableRail: $</label>
              <input
                type="number"
                value={gableRail}
                onChange={handleGableRailChange}
                className="w-full px-3 py-2 border bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <label className="block text-gray-700 mb-2">
                GablePlatform: $
              </label>
              <input
                type="number"
                value={gablePlatform}
                onChange={handleGablePlatformChange}
                className="w-full px-3 py-2 border bg-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Lower Roof 输入部分 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Lower Roof (m)</label>
            <input
              type="number"
              placeholder="Enter Lower Roof Area"
              value={lowerRoof}
              onChange={(e) => setLowerRoof(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Lower Roof Price: ${lowerRoofPrice}
            </span>
          </div>

          {/* Note 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Note</label>
            <textarea
              placeholder="Enter Note"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
          </div>
        </div>

        {/* 右边白色部分 */}
        <div className="w-1/2 p-6" style={{ backgroundColor: "#FAF9F6" }}>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Add on Details
          </h2>
          {/* Weekly Rental 输入框区域：一楼 + 二楼并排 */}
          <div className="mb-6 flex gap-4">
            {/* Ground Floor Weekly Rental */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Ground Floor Weekly Rental
              </label>
              <input
                type="text"
                value={groundWeeklyRental.toFixed(2)}
                disabled
                className="w-full px-2 py-1 bg-gray-300 border rounded text-sm"
              />
              <span className="text-gray-500">
                ${groundWeeklyRental.toFixed(2)}
                {isPremium && " (include 16 weeks rental)"}
              </span>
            </div>

            {/* Upper Floor Weekly Rental */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Upper Floor Weekly Rental
              </label>
              <input
                type="text"
                value={upperWeeklyRental.toFixed(2)}
                disabled
                className="w-full px-2 py-1 bg-gray-300 border rounded text-sm"
              />
              <span className="text-gray-500">
                ${upperWeeklyRental.toFixed(2)}
                {isPremium && " (include 16 weeks rental)"}
              </span>
            </div>
          </div>
          {/* Roof Pitch 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Roof Pitch (°)</label>
            <input
              type="text"
              value={roofPitches}
              onChange={handleRoofPitchesChange}
              placeholder="Enter Roof Pitches separated by commas"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Roof Pitches:
              <ul className="list-disc list-inside ml-2">
                {calculateRoofPitches().map((pitch, index) => (
                  <li key={index}>
                    Pitch {index + 1}: {pitch}°
                  </li>
                ))}
              </ul>
            </span>
          </div>
          {/* Raise the platform 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Raise the platform (m)
            </label>
            <input
              type="number"
              value={raiseHeight}
              onChange={handleRaiseHeightChange}
              placeholder="Enter Raise the platform"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">
              Raise Platform: ${raisePlatformPrice}
            </span>
          </div>
          {/* EdgeProtection 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm">
              Edge Protection (m)
            </label>
            <input
              type="number"
              placeholder="Enter Edge Protection"
              value={edgeLength}
              onChange={(e) => {
                const value = e.target.value;
                setEdgeLength(value);

                // 计算 Edge Protection 价格
                const price = calculateEdgeProtectionPrice(value);
                setEdgePrice(price); // 更新价格
              }}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <span className="text-gray-500">
              Edge Protection: ${edgePrice.toFixed(2)}
            </span>
          </div>
          {/* plywood 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm">
              Plywood (m)
            </label>
            <input
              type="number"
              value={plywoodQuantity} // 绑定输入框的数量值
              onChange={handlePlywoodChange} // 更新数量并计算价格
              placeholder="Enter Plywood Quantity"
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <span className="text-gray-500">
              Plywood: ${plywoodPrice.toFixed(2)} {/* 显示计算出来的价格 */}
            </span>
          </div>
          {/* Chimney 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Chimney (0, S, M, L, XL)
            </label>
            <input
              type="text"
              value={chimneySize} // 绑定输入框的值
              onChange={handleChimneyChange} // 处理输入变化
              placeholder="Enter Chimney size"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}{" "}
            {/* 显示错误信息 */}
            <div className="mt-2">
              <span className="text-gray-500">Chimney: ${chimneyPrice}</span>
              <br />
              <span className="text-gray-500">Rental: ${chimneyRental}</span>
            </div>
          </div>
          {/* FullyPlanks 输入框 */}
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

          {/* Top up 输入框 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Top up</label>
            <input
              type="number"
              value={topUp}
              onChange={handleTopUpChange}
              placeholder="Enter Top up"
              className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500">Top up: ${topUp.toFixed(2)}</span>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                Ground Floor EDC Total: ${calculateGroundEDCtotal().toFixed(2)}
              </h3>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                Upper Floor EDC Total: ${calculateUpperEDCtotal().toFixed(2)}
              </h3>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                All Total: ${calculateAlltotal().toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TwoFloorQuotePage;
