import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("❌ 請輸入帳號和密碼！");
      return;
    }

    try {
      const response = await axios.post("/admin-login", { username, password });

      if (response.data.success) {
        localStorage.setItem("admin-token", response.data.token); // ✅ 存入 Token
        navigate("/admin"); // ✅ 登入成功跳轉
      } else {
        setError("❌ 帳號或密碼錯誤！");
      }
    } catch (err) {
      console.error("❌ 登入錯誤：", err);
      setError("❌ 伺服器錯誤，請稍後再試！");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">🔐 管理員登入</h2>
        
        {/* 🔹 帳號輸入框 */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="請輸入管理員帳號"
          className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 🔹 密碼輸入框 */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
          className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 🔹 錯誤訊息 */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* 🔹 登入按鈕 */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all"
        >
          🚀 登入
        </button>
      </div>
    </div>
  );
}
