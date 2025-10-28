import React, { useEffect, useState } from "react";
import { getParkingLots } from "../firebase";
import { auth, db, rtdb, ref, onValue } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { Car } from "lucide-react";
import { FaTools, FaTrafficLight } from "react-icons/fa";
import { CiParking1 } from "react-icons/ci";

export default function SelectSlot() {
  const [user, setUser] = useState(null);
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [iotSlots, setIotSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [animationVisible, setAnimationVisible] = useState(false);

  // 🔐 Track logged-in user
  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  // 🅿️ Load parking lots (from Firestore)
  useEffect(() => {
    const loadLots = async () => {
      const data = await getParkingLots();
      setLots(data);
    };
    loadLots();
  }, []);

  // ⚡ Listen for Firestore slots of selected lot
  useEffect(() => {
    if (!selectedLot) return;

    const unsub = onSnapshot(
      collection(db, "parkingLots", selectedLot, "slots"),
      (snapshot) => {
        const liveSlots = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSlots(liveSlots);
      },
      (error) => console.error("❌ Firestore error:", error)
    );

    return () => unsub();
  }, [selectedLot]);

  // 🌐 Listen to Realtime Database (IoT Wokwi data)
  useEffect(() => {
    const slotRef = ref(rtdb, "slots/");
    const unsub = onValue(slotRef, (snapshot) => {
      const data = snapshot.val() || {};
      setIotSlots(data);
    });
    return () => unsub();
  }, []);

  // ✨ Trigger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimationVisible(true), 300);
  }, []);

  // 🚗 Toggle slot booking/unbooking (Firestore)
  const handleToggleSlot = async (slotId, rate, isBooked) => {
    if (!user) return alert("Please login first.");
    setLoading(true);

    try {
      const slotRef = doc(db, "parkingLots", selectedLot, "slots", slotId);
      const lotRef = doc(db, "parkingLots", selectedLot);

      if (isBooked) {
        await updateDoc(slotRef, {
          isBooked: false,
          bookedBy: null,
          bookedAt: null,
        });
        await updateDoc(lotRef, { availableSlots: increment(1) });
        alert(`🟢 Slot ${slotId} is now vacant.`);
      } else {
        await updateDoc(slotRef, {
          isBooked: true,
          bookedBy: user.uid,
          bookedAt: serverTimestamp(),
        });
        await updateDoc(lotRef, { availableSlots: increment(-1) });
        alert(` Slot ${slotId} booked successfully!`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <CiParking1 /> Book a Parking Slot
      </h2>

      {/* Parking Lot Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-300">
          Select Parking Lot:
        </label>
        <select
          onChange={(e) => setSelectedLot(e.target.value)}
          value={selectedLot || ""}
          className="bg-black border border-black p-3 rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA]"
        >
          <option value="">Parking Lots</option>
          {lots.map((lot) => (
            <option key={lot.id} value={lot.id}>
              {lot.name} (₹{lot.baseRate}/hr) — {lot.availableSlots} left
            </option>
          ))}
        </select>
      </div>

      {/* IoT Slots (Live Data Visualization) */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <FaTrafficLight />
          Live Sensor Data
        </h3>

        {/* Color Legend */}
        <div className="flex justify-center gap-6 mb-5 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-sm border border-green-300"></div>
            Vacant
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded-sm border border-red-300"></div>
            Occupied
          </div>
        </div>

        {/* Parking Grid Visualization */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 mb-8 justify-items-center mx-auto max-w-4xl">
          {Object.entries(iotSlots).map(([key, slot], i) => {
            const isOccupied = slot.occupied;
            const slotLabel = key.toUpperCase();

            return (
              <div
                key={key}
                className={`w-16 sm:w-20 md:w-24 aspect-square flex flex-col items-center justify-center rounded-2xl border text-center transition-all duration-300 shadow-md ${
                  isOccupied
                    ? "bg-red-400/80 border-red-300 shadow-red-400/40"
                    : "bg-green-400/80 border-green-300 shadow-green-400/40"
                } ${
                  animationVisible
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                }`}
                style={{
                  transitionDelay: `${i * 25}ms`,
                }}
              >
                <Car
                  size={18}
                  className={isOccupied ? "text-red-900" : "text-green-900"}
                />
                <p className="text-xs font-bold text-gray-900 mt-1">
                  {slotLabel}
                </p>
                <p className="text-[10px] text-gray-700">
                  {isOccupied ? "Occupied" : "Vacant"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Firestore Slots (Booking System) */}
      {selectedLot && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-8 text-center flex items-center justify-center gap-2">
            <FaTools /> Manage Slots
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 justify-items-center">
            {slots.map((slot, i) => (
              <button
                key={slot.id}
                disabled={loading}
                onClick={() =>
                  handleToggleSlot(slot.id, slot.rate, slot.isBooked)
                }
                className={`w-16 sm:w-20 md:w-24 aspect-square rounded-2xl flex flex-col items-center justify-center text-sm transition-all duration-300 ${
                  slot.isBooked
                    ? "bg-red-500/80 border border-red-300 hover:bg-red-600"
                    : "bg-green-500/80 border border-green-300 hover:bg-green-600"
                } ${
                  animationVisible
                    ? "scale-100 opacity-100"
                    : "scale-90 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <p className="font-bold">{slot.number}</p>
                <p className="text-xs text-gray-200">₹{slot.rate}/hr</p>
                <p className="text-[10px] text-gray-300">
                  {slot.isBooked ? "(Occupied)" : "(Vacant)"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
