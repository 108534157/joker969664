import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import BaccaratPrediction from "./c"; // 確保引入正確的檔案名
import Admin from "./AdminPanel"; // ✅ 確保有引入 Admin 頁面

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/baccarat" element={<BaccaratPrediction />} />
        <Route path="/admin" element={<Admin />} /> {/* ✅ 確保 /admin 路由存在 */}
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
