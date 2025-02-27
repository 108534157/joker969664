import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function AdminPanel() {
  const [points, setPoints] = useState(0);
  const [codes, setCodes] = useState([]);

  // **✅ 取得所有序號**
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await axios.get("/api/get-codes"); // ✅ 修改這裡
        if (response.data.success) {
          setCodes(response.data.codes);
        } else {
          console.warn("⚠️ 無法獲取序號列表！");
        }
      } catch (err) {
        console.error("❌ 無法獲取序號資料：", err);
      }
    };

    fetchCodes();
  }, []);

  // **✅ 產生新序號並存入資料庫**
  const generateCode = async () => {
    if (points <= 0) {
      alert("❌ 請輸入有效的點數！");
      return;
    }

    const newCode = { id: uuidv4(), value: points };

    try {
      const response = await axios.post("/api/insert-code", newCode); // ✅ 修改這裡
      if (response.data.success) {
        setCodes((prevCodes) => [...prevCodes, newCode]); // 更新畫面
        setPoints(0);
        alert(`✅ 序號生成成功: ${newCode.id} (${newCode.value} 點)`);
      } else {
        alert("❌ 儲存序號至資料庫失敗！");
      }
    } catch (err) {
      console.error("❌ 儲存時發生錯誤：", err);
      alert("❌ 無法連接後端，請確認伺服器運行中！");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">管理員後台 - 點數發放</h2>
      
      {/* 🔹 輸入點數 */}
      <div className="mb-4">
        <label className="block mb-2">輸入點數數量：</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="w-full p-2 bg-gray-700 text-white rounded"
        />
      </div>

      {/* 🔹 產生序號按鈕 */}
      <button
        onClick={generateCode}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        產生序號
      </button>

      {/* 🔹 顯示已產生的序號 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">已產生序號：</h3>
        <ul className="bg-gray-800 p-4 rounded-lg max-h-40 overflow-auto">
          {codes.length > 0 ? (
            codes.map((code) => (
              <li key={code.id} className="text-sm text-orange-400">
                {code.id} - {code.value} 點
              </li>
            ))
          ) : (
            <p className="text-gray-400">⚠️ 尚未產生任何序號</p>
          )}
        </ul>
      </div>
    </div>
  );
}
