import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreatePage from "./pages/CreatePage";
import Plan from "./pages/Plan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/plan/create" element={<CreatePage />} />
        <Route path="plan/:planCode" element={<Plan />} />
      </Routes>
    </Router>
  );
}

export default App;
