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
  const qrRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);

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

  // ✅ Initialize camera safely
  useEffect(() => {
    if (!user) return;
    const qrRegionId = "qr-region";
    const html5QrCode = new Html5Qrcode(qrRegionId);

    async function startScanner() {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameraStarted(true);
          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            handleScan,
            handleError
          );
          qrRef.current = html5QrCode;
        } else {
          setStatus("❌ No camera detected. Try uploading an image instead.");
        }
      } catch (err) {
        console.error("Camera start error:", err);
        setStatus("⚠️ Please allow camera access in your browser.");
      }
    }

    startScanner();

    return () => {
      if (qrRef.current) {
        qrRef.current.stop().catch(() => {});
        qrRef.current.clear();
      }
    };
  }, [user]);

  // ✅ Handle scanning logic
  const handleScan = async (data) => {
    if (!data || !user || !userData) return;
    qrRef.current?.stop(); // stop camera after successful scan
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
    } catch (err) {
      console.error(err);
      setStatus("❌ Error verifying QR.");
    }
  };

  const handleError = (err) => {
    console.warn("Scan error:", err);
  };

  // ✅ Image upload fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("Scanning image...");
    try {
      const html5QrCode = new Html5Qrcode("qr-region");
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
            id="qr-region"
            className="w-full h-64 bg-black mb-4 rounded-xl"
          />

          {!cameraStarted && (
            <p className="text-yellow-400 text-sm mb-4">
              Camera not started. You can upload a QR image instead.
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block mx-auto mb-4 text-sm text-gray-400"
          />

          <p className="text-sm text-gray-400 mb-2">
            {scannedData
              ? `Scanned: ${scannedData}`
              : "Align QR within the frame or upload image"}
          </p>

          <p
            className={`text-lg ${
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
