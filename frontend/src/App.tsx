import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InspekcijskaTijelaPage from "./pages/InspekcijskaTijelaPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <Navbar />
      <div className="mt-3">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inspekcijska-tijela" element={<InspekcijskaTijelaPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
