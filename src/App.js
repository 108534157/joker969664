import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import BaccaratPrediction from "./c";
import Admin from "./AdminPanel";
import AdminLogin from "./AdminLogin"; // ✅ 引入新的管理員登入頁面

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/baccarat" element={<BaccaratPrediction />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* ✅ 新增管理員登入 */}
        <Route path="/admin" element={<Admin />} /> {/* ✅ 管理員頁面 */}
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
