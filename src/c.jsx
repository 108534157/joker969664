import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectItem } from './components/ui/select';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, MessageCircle, Instagram, LogOut, CheckCircle } from "lucide-react";
import Swal from 'sweetalert2';
export default function LogoutButton() {
  const navigate = useNavigate();

  

  // -----------------------------
  // 狀態管理
  // -----------------------------
  const [platform, setPlatform] = useState("");
  const [roadType, setRoadType] = useState("");
  const [room, setRoom] = useState("");
  const [points, setPoints] = useState(0); // ⭐ 加入點數狀態
  const [userCode, setUserCode] = useState(""); // ⭐ 存放登入的序號c
  // stats 使用英文 key，之後用 mapping 來對應「莊、閒、和」
  const [stats, setStats] = useState({ banker: 0, player: 0, tie: 0 });
  const [grid, setGrid] = useState(Array(60).fill(""));
  const [prediction, setPrediction] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // ✅ 是否已連線
  const [showConnectionModal, setShowConnectionModal] = useState(false); // ✅ 顯示連線成功彈窗
  const [roomOptions, setRoomOptions] = useState([]); // ⭐ 動態房號選項
  
   // 房號對應表
   useEffect(() => {
    // 內部定義房號對應表，避免 ESLint 警告
    const roomOptionsMap = {
      "DG真人": ["D01", "D02", "D03", "D05", "D06", "D07", "D08", "D09", "D10", "D11", "D12", "D13", "D15", "C01", "C02", "C03", "C05", "C06"],
      "MT真人": ["百家廳1", "百家廳2", "百家廳3", "百家廳3A", "百家廳5", "百家廳6", "百家廳7", "百家廳8", "百家廳9", "百家廳10", "百家廳11", "百家廳12", "百家廳13"],
      "SA真人": ["百家樂D01", "百家樂D02", "百家樂D03", "百家樂D04", "百家樂D05", "百家樂D06", "百家樂D07", "百家樂D08", "百家樂C01", "百家樂C02", "百家樂C03", "百家樂C04", "百家樂C05", "百家樂C06", "百家樂C07", "百家樂C08"],
      "WM真人": ["性感百家樂1", "性感百家樂2", "性感百家樂3", "性感百家樂4", "性感百家樂5", "急速百家樂6", "急速百家樂7", "急速百家樂8", "急速百家樂9", "急速百家樂10", "急速百家樂11", "急速百家樂12", "百家樂13", "百家樂14", "百家樂15", "百家樂16", "百家樂17", "百家樂18", "咪牌百家樂19"],
      "歐博真人": ["快速百家樂Q001", "性感百家樂B501", "性感百家樂B502", "性感百家樂B503", "性感百家樂B504", "性感百家樂B505", "性感百家樂B506", "快速百家樂Q002", "快速百家樂Q003", "快速百家樂Q202", "快速百家樂Q203", "百家樂B001", "百家樂B002", "百家樂B003", "百家樂B004", "百家樂B005", "百家樂B006", "百家樂B007", "百家樂B008", "百家樂B201", "百家樂B202", "經典百家樂B018", "經典百家樂B019", "經典百家樂B219"]
    };
  
    if (platform) {
      setRoomOptions(roomOptionsMap[platform] || []);
      setRoom(""); // 重置房號
    } else {
      setRoomOptions([]);
    }
  }, [platform]);
// 當房號變更時，解除連線狀態，讓用戶可以重新連線
useEffect(() => {
  if (room) {
    setIsConnected(false);
  }
}, [room]);
  
  // 取得點數
  useEffect(() => {
    const storedCode = localStorage.getItem("login-token");
    if (!storedCode) {
      console.warn("⚠️ 未登入，跳轉至 /login");
      navigate("/login", { replace: true }); // ✅ 確保 `/login` 正確載入
    } else {
      setUserCode(storedCode);
    }
  }, [navigate]);

  // **🔹 取得點數**
  useEffect(() => {
    if (!userCode) return;
    axios.post("http://localhost:4000/validate-code", { code: userCode })
      .then((res) => {
        if (res.data.valid) {
          setPoints(res.data.points);
        } else {
          setPoints(0);
        }
      })
      .catch((err) => console.error("❌ 取得點數失敗", err));
  }, [userCode]);

  // **🔹 登出功能**
  const handleLogout = () => {
    console.log("🚪 正在登出...");
    setIsLoading(false); // ✅ 確保登出時解除鎖定
    localStorage.clear(); // ✅ 移除所有 localStorage 內容
    navigate("/login", { replace: true }); // ✅ 強制跳轉到登入頁面，避免回上一頁
  };
  const handleConnect = () => {
    if (!platform || !roadType || !room) {
      alert("❌ 請先選擇「平台」、「珠盤路類型」及「房號」！");
      return;
    }
    setShowConnectionModal(true);
    setTimeout(() => {
      setIsConnected(true);
      setShowConnectionModal(false);
    }, 2000); // 🎬 2秒動畫後自動關閉彈窗
  };
  // **🔹 預測功能**
 // **🔹 預測功能 (加入扣點提醒)**
 const predictNext = () => {
  if (!isConnected) {
    Swal.fire({
      icon: 'warning',
      title: '⚠️ 請先完成連線！',
      confirmButtonColor: '#3085d6',
      confirmButtonText: '知道了',
    });
    return;
  }

  if (points <= 0) {
    Swal.fire({
      icon: 'error',
      title: '❌ 點數不足',
      text: '請先輸入有效序號！',
      confirmButtonColor: '#d33',
      confirmButtonText: '了解',
    });
    return;
  }

  // ✅ 提醒用戶扣點確認
  Swal.fire({
    title: '⚡ 確定要預測嗎？',
    text: '系統將扣除 1 點進行預測。',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: '✅ 確認',
    cancelButtonText: '❌ 取消',
  }).then((result) => {
    if (result.isConfirmed) {
      if (isLoading) return;
      setIsLoading(true);
      axios
        .post("http://localhost:4000/update-points", { code: userCode })
        .then((res) => {
          if (res.data.success) {
            setPoints(res.data.points);
            Swal.fire({
              icon: 'success',
              title: '✅ 成功扣點！',
              text: `剩餘點數：${res.data.points} 點`,
              confirmButtonColor: '#28a745',
            });
            executePrediction();
          } else {
            Swal.fire({
              icon: 'error',
              title: '❌ 扣點失敗！',
              text: '請稍後再試！',
              confirmButtonColor: '#d33',
            });
          }
        })
        .catch(() =>
          Swal.fire({
            icon: 'error',
            title: '⚡ 發生錯誤',
            text: '請稍後再試！',
            confirmButtonColor: '#d33',
          })
        )
        .finally(() => setIsLoading(false));
    }
  });
};


  // -----------------------------
  // 動畫按鈕元件
  // -----------------------------
  const MotionButton = ({ onClick, children, className, disabled }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
  
  // 從 localStorage 載入先前儲存的資料
  useEffect(() => {
    const savedData = localStorage.getItem("baccarat-prediction");
    if (savedData) {
      const {
        platform: sPlatform,
        roadType: sRoadType,
        room: sRoom,
        stats: sStats,
        grid: sGrid,
      } = JSON.parse(savedData);
      if (sPlatform) setPlatform(sPlatform);
      if (sRoadType) setRoadType(sRoadType);
      if (sRoom) setRoom(sRoom);
      if (sStats) setStats(sStats);
      if (sGrid) setGrid(sGrid);
    }
  }, []);

  // 將當前資料存入 localStorage
  useEffect(() => {
    const dataToSave = {
      platform,
      roadType,
      room,
      stats,
      grid,
    };
    localStorage.setItem("baccarat-prediction", JSON.stringify(dataToSave));
  }, [platform, roadType, room, stats, grid]);

  // -----------------------------
  // 將「莊、閒、和」對應到 stats 的 key
  // -----------------------------
  const handlePrediction = (type) => {
    const mapping = {
      "莊": "banker",
      "閒": "player",
      "和": "tie",
    };

    // 1. 更新統計數字
    setStats((prev) => ({
      ...prev,
      [mapping[type]]: prev[mapping[type]] + 1,
    }));

    // 2. 在珠盤路上填入結果
    setGrid((prev) => {
      const newGrid = [...prev];
      for (let col = 0; col < 10; col++) {
        for (let row = 0; row < 6; row++) {
          const index = col + row * 10;
          if (newGrid[index] === "") {
            newGrid[index] = type;
            return newGrid;
          }
        }
      }
      return newGrid;
    });
  };

  // -----------------------------
  // 重置所有資料
  // -----------------------------
  const resetStats = () => {
    setStats({ banker: 0, player: 0, tie: 0 });
    setPrediction("");
    setAnalysis("");
    setGrid(Array(60).fill(""));
  };

  // -----------------------------
  // 舊的 advancedAnalysis, 保留用
  // -----------------------------
  function advancedAnalysis(last10) {
    const stats10 = { "莊": 0, "閒": 0, "和": 0 };
    last10.forEach((item) => {
      stats10[item]++;
    });

    const maxSide = Object.keys(stats10).reduce((a, b) => (stats10[a] > stats10[b] ? a : b));
    const minSide = Object.keys(stats10).reduce((a, b) => (stats10[a] < stats10[b] ? a : b));

    let msg = `過去 10 局中，莊出現 ${stats10["莊"]} 次、閒出現 ${stats10["閒"]} 次、和出現 ${stats10["和"]} 次。\n`;
    msg += `在這 10 局裡，最常見的結果為「${maxSide}」，最少的則是「${minSide}」。`;

    let maxStreak = 1;
    let currentStreak = 1;
    let altCount = 1;
    let altPattern = false;

    for (let i = 1; i < last10.length; i++) {
      // 計算連開
      if (last10[i] === last10[i - 1]) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
      // 計算交替
      if (last10[i] !== last10[i - 1]) {
        altCount++;
      } else {
        altCount = 1;
      }
      if (altCount >= 4) {
        altPattern = true;
      }
    }

    if (maxStreak >= 3) {
      msg += `\n近 10 局當中，曾出現過連續 ${maxStreak} 手的相同結果 (如連莊或連閒)。`;
    }

    if (altPattern) {
      msg += `\n近期也有至少 4 手交替的走勢 (莊→閒→莊→閒...)，表示牌局的結果波動較大。`;
    }

    if (stats10["和"] > 2) {
      msg += `\n過去 10 局 "和" 出現了 ${stats10["和"]} 次，可留意後續再次出現和的可能。`;
    }

    const bankerRate = stats10["莊"] / last10.length;
    if (bankerRate > 0.7) {
      msg += `\n莊在近 10 局中佔比超過 70%，可觀察是否有莊家長紅趨勢。`;
    }

    const playerRate = stats10["閒"] / last10.length;
    if (playerRate > 0.7) {
      msg += `\n閒在近 10 局中佔比超過 70%，顯示閒家近期手氣旺盛。`;
    }

    return msg;
  }

  function analyzeBigEyeBoy(results) {
    if (results.length < 2) {
      return "大眼仔分析: 資料不足";
    }
    let color = "藍";
    let streak = 1;
    for (let i = 1; i < results.length; i++) {
      if (results[i] === results[i - 1]) {
        streak++;
      } else {
        streak = 1;
      }
    }
    if (streak >= 2) {
      color = "紅";
    }

    return `大眼仔(示範): 連開 ${streak} ，標記為${color}`;
  }

  function superAdvancedAnalysis(allResults) {
    if (allResults.length === 0) {
      return "無法進行深度分析，因為尚未有任何記錄。";
    }

    const last10 = allResults.slice(-10);
    let msg = advancedAnalysis(last10);

    if (roadType === "大眼仔") {
      msg += "\n" + analyzeBigEyeBoy(allResults);
    }

    const last20 = allResults.slice(-20);
    if (last20.length >= 10) {
      const stats20 = { "莊": 0, "閒": 0, "和": 0 };
      last20.forEach((cell) => {
        stats20[cell]++;
      });
      const total20 = last20.length;
      msg += "\n\n【最近 20 局統計】:";
      msg += `\n莊出現 ${stats20["莊"]} 次 (${((stats20["莊"] / total20) * 100).toFixed(1)}%)`;
      msg += `\n閒出現 ${stats20["閒"]} 次 (${((stats20["閒"] / total20) * 100).toFixed(1)}%)`;
      msg += `\n和出現 ${stats20["和"]} 次 (${((stats20["和"] / total20) * 100).toFixed(1)}%)`;
      const bankerRate = stats20["莊"] / total20;
      const playerRate = stats20["閒"] / total20;
      if (bankerRate > 0.6) {
        msg += `\n→ 莊在近 20 局佔比 > 60%，表示近期偏莊。`;
      } else if (playerRate > 0.6) {
        msg += `\n→ 閒在近 20 局佔比 > 60%，顯示閒家強勢。`;
      }
    }

    let maxStreak = 1;
    let currentStreak = 1;
    let dragonResult = "";
    for (let i = 1; i < allResults.length; i++) {
      if (allResults[i] === allResults[i - 1]) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          dragonResult = allResults[i];
        }
      } else {
        currentStreak = 1;
      }
    }
    if (maxStreak >= 4) {
      msg += `\n\n【長龍預警】：曾出現過 ${dragonResult} ${maxStreak} 連開 (長龍)！`;
    }

    if (allResults.length >= 6) {
      let foundBreak = false;
      for (let i = allResults.length - 2; i >= 2; i--) {
        if (
          allResults[i] === allResults[i - 1] &&
          allResults[i] === allResults[i - 2]
        ) {
          const triple = allResults[i];
          if (allResults[i + 1] && allResults[i + 1] !== triple) {
            msg += `\n【斷龍訊息】：在末段發生「${triple}」連開 3 手後，被「${allResults[i + 1]}」切斷。`;
            foundBreak = true;
            break;
          }
        }
      }
      if (!foundBreak) {
        msg += "\n近期未出現明顯的 '斷龍' 現象。";
      }
    }

    return msg;
  }

  function calcProbabilitiesWithWeight(allResults) {
    const base = 1.1;
    let bankerCnt = 0;
    let playerCnt = 0;
    let tieCnt = 0;
    const length = allResults.length;
    if (length === 0) {
      return {
        bankerProb: 0,
        playerProb: 0,
        tieProb: 0,
        confidence: 0,
      };
    }

    for (let i = 0; i < length; i++) {
      const result = allResults[i];
      const exponent = i;
      const weight = Math.pow(base, exponent);

      if (result === "莊") {
        bankerCnt += weight;
      } else if (result === "閒") {
        playerCnt += weight;
      } else if (result === "和") {
        tieCnt += weight;
      }
    }

    const sum = bankerCnt + playerCnt + tieCnt;
    if (sum === 0) {
      return {
        bankerProb: 0,
        playerProb: 0,
        tieProb: 0,
        confidence: 0,
      };
    }

    const bankerProb = bankerCnt / sum;
    const playerProb = playerCnt / sum;
    const tieProb = tieCnt / sum;
    const sorted = [bankerProb, playerProb, tieProb].sort((a, b) => b - a);
    const confidence = sorted[0] - sorted[1];

    return {
      bankerProb,
      playerProb,
      tieProb,
      confidence,
    };
  }

  function getBetStrategy(finalPredict, confidence) {
    if (confidence < 0.1) {
      return `AI 建議：走勢不明，先觀望！`;
    } else if (confidence > 0.3) {
      return `AI 建議：下注「${finalPredict}」`;
    }
    return `AI 建議：小注嘗試「${finalPredict}」或觀望`;
  }

  const executePrediction = () => {
    const recentGames = grid.filter((cell) => cell !== "").slice(-5);
    if (recentGames.length === 0) {
      setPrediction("無法預測");
      setAnalysis("請先輸入數據");
      return;
    }
    const counts = { "莊": 0, "閒": 0, "和": 0 };
    recentGames.forEach((r) => counts[r]++);

    const basicStats = `過去五局中，莊出現 ${counts["莊"]} 次、閒出現 ${counts["閒"]} 次、和出現 ${counts["和"]} 次。`;

    const lastResult = recentGames[recentGames.length - 1];
    let streakLength = 1;
    for (let i = recentGames.length - 2; i >= 0; i--) {
      if (recentGames[i] === lastResult) {
        streakLength++;
      } else {
        break;
      }
    }
    let streakInfo = "";
    if (streakLength > 1) {
      streakInfo = `最近已連開「${lastResult}」${streakLength} 手。`;
    }

    let tieNote = "";
    if (counts["和"] > 1) {
      tieNote = `目前和局較多（${counts["和"]} 手），可留意可能再出和。`;
    }

    const allResults = grid.filter((cell) => cell !== "");
    const superAnalysis = superAdvancedAnalysis(allResults);

    const { bankerProb, playerProb, tieProb, confidence } = calcProbabilitiesWithWeight(allResults);

    let finalPredict = "莊";
    let bestProb = bankerProb;
    if (playerProb > bestProb) {
      finalPredict = "閒";
      bestProb = playerProb;
    }
    if (tieProb > bestProb) {
      finalPredict = "和";
      bestProb = tieProb;
    }

    let probabilityNote = `\n\n【機率化評估】：\n` +
      `莊: ${(bankerProb * 100).toFixed(1)}%  閒: ${(playerProb * 100).toFixed(1)}%  和: ${(tieProb * 100).toFixed(1)}%`;
    probabilityNote += `\nAI 信心水準 (0~1): ${confidence.toFixed(2)}`;

    const betAdvice = getBetStrategy(finalPredict, confidence);

    const additionalAnalysis = [streakInfo, tieNote].filter(Boolean).join("\n");
    const detail = `【分析原因】：${basicStats}\n${additionalAnalysis}\n` +
      `根據 ${roadType} 珠盤路、以及更進階的加權機率，下一局最可能開出「${finalPredict}」。` +
      `\n${probabilityNote}\n${betAdvice}\n\n${superAnalysis}`;

    setPrediction(finalPredict);
    setAnalysis(detail);
  };


  // 只保留深色模式

  return (
    <div className="min-h-screen w-full bg-gray-800 text-white flex flex-col items-center py-8 px-4">
      <div className="max-w-xl w-full bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 flex flex-col items-center space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-400 text-center">百家樂預測網</h1>

                 {/* ✅ 顯示當前序號 & 點數 */}
        <div className="text-lg mt-2 bg-gray-900 p-2 rounded text-center w-full">
          <p>當前序號：{userCode || "未登入"}</p>
          <p>當前點數：{points} 點</p>
        </div>
              {/* ✅ 新增「登出」按鈕 */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
        >
          <LogOut size={20} />
          登出
        </button>
     {/* 🎯 選擇器 (預設為 "請選擇...") */}
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-6">
    <div className="w-full max-w-xs mx-auto text-center">
  <span className="block font-medium mb-2">選擇分析的珠盤路類型：</span>
  <Select
    value={roadType}
    onChange={(e) => setRoadType(e.target.value)}
    className="w-full"
  >
    <SelectItem value="">請選擇...</SelectItem>
    <SelectItem value="大路">大路</SelectItem>
  </Select>
</div>

<div className="w-full max-w-xs mx-auto text-center">
        <span className="block font-medium text-center mb-2">選擇遊玩的百家樂平台：</span>
        <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full">
          <SelectItem value="">請選擇...</SelectItem>
          <SelectItem value="DG真人">DG真人</SelectItem>
          <SelectItem value="MT真人">MT真人</SelectItem>
          <SelectItem value="SA真人">SA真人</SelectItem>
          <SelectItem value="WM真人">WM真人</SelectItem>
          <SelectItem value="歐博真人">歐博真人</SelectItem>
        </Select>
  </div>

    {/* 選擇房號 (依據平台動態更新) */}
    <div className="w-full max-w-xs mx-auto text-center">
        <span className="block font-medium text-center mb-2">選擇房號：</span>
        <Select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full">
          <SelectItem value="">請選擇...</SelectItem>
          {roomOptions.map((roomOption, index) => (
            <SelectItem key={index} value={roomOption}>{roomOption}</SelectItem>
          ))}
        </Select>
  </div>
</div>



        {/* 🎯 連線按鈕 (動畫彈窗) */}
        <MotionButton
          onClick={handleConnect}
          className={`w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600`}
          disabled={isConnected}
        >
          {isConnected ? "✅ 已連線" : "🔗 連線"}
        </MotionButton>

        <AnimatePresence>
  {showConnectionModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-10 shadow-2xl text-white text-center w-[90%] max-w-md"
      >
        <CheckCircle size={72} className="text-white mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-extrabold mb-2">🎉 連線成功！</h2>
        <p className="text-lg mb-6">您現在可以開始預測下一局走勢。</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowConnectionModal(false)}
          className="bg-white text-green-600 font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-all"
        >
          開始預測 🚀
        </motion.button>
      </motion.div>
    </motion.div>
  )}ㄏ
        </AnimatePresence>
     

        {/* 統計區塊 */}
        <div className="w-full text-center text-lg font-semibold">
          莊: {stats.banker} &nbsp; 閒: {stats.player} &nbsp; 和: {stats.tie}
        </div>

        {/* 預測結果區塊：使用 AnimatePresence 包裹，以淡入效果出現 */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              key="analysisCard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-700 shadow rounded-lg text-white text-center w-full"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-green-500"
                >
                  <PartyPopper size={48} />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">預測結果: {prediction}</h2>
              </div>
              <p className="text-sm whitespace-pre-line text-left leading-relaxed mt-2">
                {analysis}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 珠盤路區塊：每個格子用 Motion.div 做小幅度 scale 動畫 */}
        <div className="grid grid-cols-10 gap-1 bg-gray-700 p-4 rounded-lg shadow w-full">
          {grid.map((cell, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              className={`w-6 h-6 border border-gray-500 flex items-center justify-center text-sm font-bold transition-colors ${
                cell === "莊"
                  ? "bg-red-500 text-white"
                  : cell === "閒"
                  ? "bg-blue-500 text-white"
                  : cell === "和"
                  ? "bg-green-500 text-white"
                  : ""
              }`}
            >
              {cell}
            </motion.div>
          ))}
        </div>
   {/* 中間區塊：莊、閒、和 按鈕、重置、預測 */}
   <div className="flex gap-4 flex-wrap justify-center">
          <MotionButton
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handlePrediction("莊")}
          >
            莊
          </MotionButton>
          <MotionButton
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handlePrediction("閒")}
          >
            閒
          </MotionButton>
          <MotionButton
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handlePrediction("和")}
          >
            和
          </MotionButton>
          <MotionButton
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={resetStats}
          >
            重置
          </MotionButton>
        </div>
     {/* 預測按鈕 */}
     <MotionButton
  className={`px-6 py-2 rounded font-bold ${
    points <= 0 || isLoading ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-yellow-500 text-black hover:bg-yellow-600"
  }`}
  onClick={predictNext}
  disabled={points <= 0 || isLoading} // 🔒 禁用按鈕
>
  {isLoading ? "預測中..." : "預測 (扣 1 點)"}
</MotionButton>

        
        {/* 加上著作權 & 聯絡資訊 */}
        <div className="mt-6 text-sm text-center text-gray-300">
          <div className="flex items-center justify-center gap-1 mb-2">
            <MessageCircle size={16} />
            <span>LINE: @524yhwzn</span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            <Instagram size={16} />
            <span>IG: joker969664</span>
          </div>
          <p>© 2025 3A娛樂城 唐老大開發</p>
        </div>

      </div>
    </div>
  );
}
