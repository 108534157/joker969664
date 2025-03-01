import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import BaccaratPrediction from "./BaccaratPrediction"; // 🛠️ 確保正確的檔案名！
import Admin from "./AdminPanel"; // ✅ 確保有引入 Admin 頁面

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/baccarat" element={<BaccaratPrediction />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
