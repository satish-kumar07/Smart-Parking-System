import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { auth, db } from "../firebase";
import {
  doc,
  onSnapshot,
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
  const qrRef = useRef(null);
  const qrRegionId = "qr-region";

  // ✅ Live user listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const unsubUser = onSnapshot(
          doc(db, "users", currentUser.uid),
          (snap) => {
            if (snap.exists()) setUserData(snap.data());
          }
        );
        return () => unsubUser();
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubAuth();
  }, []);

  // ✅ Start camera
  const startCamera = async () => {
    if (!user) return;
    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrRef.current = html5QrCode;
    setStatus("Starting camera...");

    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: calculateQrboxSize() },
          handleScan,
          (err) => console.warn("Scan error:", err)
        );
        setCameraStarted(true);
        setStatus("Camera ready — align QR in frame.");
      } else {
        setStatus("❌ No camera detected.");
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatus("⚠️ Please allow camera access.");
    }
  };

  const calculateQrboxSize = () => {
    const width = window.innerWidth;
    return width < 600 ? width * 0.8 : 300;
  };

  // ✅ Handle QR result
  const handleScan = async (data) => {
    if (!data || !user || !userData) return;
    setScannedData(data);
    setStatus("Processing QR...");
    qrRef.current?.stop().catch(() => {});

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

      setStatus("✅ Access Approved — Gate Opening!");
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
      const result = await html5QrCode.scanFileV2(file, true);
      handleScan(result.decodedText);
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
          ) : (
            <button
              onClick={() => qrRef.current?.stop()}
              className="bg-gray-500 px-4 py-2 rounded-xl text-white font-medium hover:bg-gray-600"
            >
              Stop Camera
            </button>
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
