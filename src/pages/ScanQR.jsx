import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ENTRY_FEE = 20;
const MIN_BALANCE = 20;

export default function ScanQR() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState("Waiting to scan QR...");
  const [scannedData, setScannedData] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const html5QrCodeRef = useRef(null);
  const qrRegionId = "qr-region";

  // ✅ Fetch user info
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) setUserData(snap.data());
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsub();
  }, []);

  // ✅ Start camera when user clicks “Start Camera”
  const startCamera = async () => {
    if (!user) return;
    const html5QrCode = new Html5Qrcode(qrRegionId);
    html5QrCodeRef.current = html5QrCode;

    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setCameraStarted(true);
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: calculateQrboxSize(), aspectRatio: 1.0 },
          () => {} // No auto scanning callback
        );
        setCameraReady(true);
        setStatus("Camera ready. Tap Scan Now to capture QR.");
      } else {
        setStatus("❌ No camera detected.");
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatus("⚠️ Please allow camera access.");
    }
  };

  // ✅ Dynamically adjust qrbox for mobile
  const calculateQrboxSize = () => {
    const screenWidth = window.innerWidth;
    return screenWidth < 600 ? screenWidth * 0.8 : 300;
  };

  // ✅ Manually trigger a scan
  const handleManualScan = async () => {
    if (!html5QrCodeRef.current) return;
    setStatus("Scanning...");
    try {
      const qrResult = await html5QrCodeRef.current.scanOnce({
        fps: 10,
        qrbox: calculateQrboxSize(),
      });
      handleScan(qrResult.decodedText);
    } catch (err) {
      console.error("Scan failed:", err);
      setStatus("❌ No QR detected. Try again.");
    }
  };

  // ✅ Handle QR result + Firestore logic
  const handleScan = async (data) => {
    if (!data || !user || !userData) return;
    setScannedData(data);
    setStatus("Processing QR...");

    try {
      let lotInfo;
      try {
        lotInfo = JSON.parse(data);
      } catch {
        const params = new URLSearchParams(data.split("?")[1]);
        lotInfo = { lotId: params.get("lotId") };
      }

      if (!lotInfo?.lotId) {
        setStatus("❌ Invalid QR code");
        return;
      }

      if (userData.balance < MIN_BALANCE) {
        setStatus("⚠️ Insufficient balance. Please recharge.");
        return;
      }

      const newBalance = userData.balance - ENTRY_FEE;
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        balance: newBalance,
        lastEntry: serverTimestamp(),
      });

      await addDoc(collection(db, "users", user.uid, "transactions"), {
        description: `Entry at Lot ${lotInfo.lotId}`,
        lotId: lotInfo.lotId,
        amount: -ENTRY_FEE,
        date: new Date().toLocaleString(),
        timestamp: serverTimestamp(),
      });

      setUserData({ ...userData, balance: newBalance });
      setStatus("✅ Access Approved — Gate Opening!");
      await html5QrCodeRef.current.stop();
    } catch (err) {
      console.error(err);
      setStatus("❌ Error verifying QR.");
    }
  };

  // ✅ Image upload fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("Scanning image...");
    try {
      const html5QrCode = new Html5Qrcode(qrRegionId);
      const result = await html5QrCode.scanFile(file, true);
      handleScan(result);
    } catch (err) {
      console.error("Image scan failed:", err);
      setStatus("❌ Could not read QR from image.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 text-white text-center">
      <h2 className="text-2xl font-bold mb-4">Scan Parking QR Code</h2>

      {!user ? (
        <p>Please log in to scan the parking QR code.</p>
      ) : (
        <>
          <div
            id={qrRegionId}
            className="relative mx-auto mb-4 rounded-xl bg-black overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
              aspectRatio: "1/1",
            }}
          />

          {!cameraStarted ? (
            <button
              onClick={startCamera}
              className="bg-blue-500 px-4 py-2 rounded-xl text-white font-medium hover:bg-blue-600"
            >
              Start Camera
            </button>
          ) : cameraReady ? (
            <button
              onClick={handleManualScan}
              className="bg-green-500 px-4 py-2 rounded-xl text-white font-medium hover:bg-green-600"
            >
              Scan Now
            </button>
          ) : (
            <p className="text-yellow-400">Starting camera...</p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block mx-auto mt-4 text-sm text-gray-400"
          />

          <p className="text-sm text-gray-400 mt-3">
            {scannedData
              ? `Scanned: ${scannedData}`
              : "Align QR within the frame or upload image"}
          </p>

          <p
            className={`text-lg mt-2 ${
              status.startsWith("✅")
                ? "text-green-400"
                : status.startsWith("❌")
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {status}
          </p>

          {userData && (
            <p className="mt-3 text-gray-300 text-sm">
              Balance: ₹{userData.balance}
            </p>
          )}
        </>
      )}
    </div>
  );
}
