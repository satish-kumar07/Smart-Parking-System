import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import SelectSlot from "./pages/SelectSlot";
import Footer from "./components/Footer";
import ScanQR from "./pages/ScanQR";
import GenerateQRCodes from "./pages/GenerateQRCodes";
import ChatBot from "./components/ChatBot"; // ✅ Import chatbot component

function App() {
  // Optional Firestore connection check
  // useEffect(() => {
  //   async function checkDB() {
  //     try {
  //       const snap = await getDocs(collection(db, "users"));
  //       console.log("✅ Firestore Connected. User docs count:", snap.size);
  //     } catch (err) {
  //       console.error("❌ Firestore Connection Failed:", err);
  //     }
  //   }
  //   checkDB();
  // }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0A0B] via-[#1A1A2E] to-[#16213E] text-white">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/slot" element={<SelectSlot />} />
          <Route path="/scan" element={<ScanQR />} />
          <Route path="/generateqr" element={<GenerateQRCodes />} />
        </Routes>
        <Footer />

        {/* ✅ Floating Chatbot Widget */}
        <ChatBot />
      </Router>
    </div>
  );
}

export default App;
