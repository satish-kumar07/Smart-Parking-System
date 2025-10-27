import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import SelectSlot from "./pages/SelectSlot";
// import { AnimatedBackground } from "animated-backgrounds";

function App() {
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
    <div className="bg-gradient-to-br from-[#0A0A0B] via-[#1A1A2E] to-[#16213E]">
      {/* // <div> */}
      {/* <AnimatedBackground animationName="starryNight" blendMode="difference" /> */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/slot" element={<SelectSlot />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
