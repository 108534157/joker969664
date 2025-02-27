import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // **🔹 如果已登入，直接跳轉 `/baccarat`**
  useEffect(() => {
    const token = localStorage.getItem("login-token");
    if (token) {
      navigate("/baccarat"); 
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!codeInput.trim()) {
      setError("❌ 請輸入有效的序號！");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/validate-code", {
        code: codeInput.trim(),
      });

      if (response.data.valid) {
        localStorage.setItem("login-token", codeInput.trim());
        localStorage.setItem("points", response.data.points);
        navigate("/baccarat"); 
      } else {
        setError("❌ 序號無效，請重新確認！");
      }
    } catch (err) {
      console.error("❌ 登入失敗：", err);
      setError("❌ 伺服器錯誤，請稍後再試！");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">🔐 登入 - 輸入序號</h2>
        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="請輸入序號..."
          className="w-full p-3 bg-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
