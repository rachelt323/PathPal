import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Plan from "./pages/PlanPage/Plan.jsx";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import { AuthProvider } from "./util/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="plan/:planCode" element={<Plan />} />
          <Route path="plan/:planCode/explore" element={<ExplorePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
