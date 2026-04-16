import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import GamePage from "./pages/GamePage";
import VerifyPage from "./pages/VerifyPage";

const App = () => {
  return (
    <div className="min-h-screen bg-[#05070f] text-white">

      <Routes>
        <Route path="/" element={<Navigate to="/game" />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>

    </div>
  );
};

export default App;