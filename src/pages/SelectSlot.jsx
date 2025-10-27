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

export default function SelectSlot() {
  const [user, setUser] = useState(null);
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [iotSlots, setIotSlots] = useState({});
  const [loading, setLoading] = useState(false);

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

  // 🚗 Toggle slot booking/unbooking (Firestore only)
  const handleToggleSlot = async (slotId, rate, isBooked) => {
    if (!user) return alert("Please login first.");
    setLoading(true);

    try {
      const slotRef = doc(db, "parkingLots", selectedLot, "slots", slotId);
      const lotRef = doc(db, "parkingLots", selectedLot);

      if (isBooked) {
        // ✅ Unbook the slot
        await updateDoc(slotRef, {
          isBooked: false,
          bookedBy: null,
          bookedAt: null,
        });
        await updateDoc(lotRef, { availableSlots: increment(1) });
        alert(`🟢 Slot ${slotId} is now vacant.`);
      } else {
        // 🔴 Book the slot
        await updateDoc(slotRef, {
          isBooked: true,
          bookedBy: user.uid,
          bookedAt: serverTimestamp(),
        });
        await updateDoc(lotRef, { availableSlots: increment(-1) });
        alert(`🚗 Slot ${slotId} booked successfully!`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-2xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center">
        🅿️ Book a Parking Slot
      </h2>

      {/* Parking Lot Selection */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Parking Lot:</label>
        <select
          onChange={(e) => setSelectedLot(e.target.value)}
          value={selectedLot || ""}
          className="bg-[#111] border border-gray-700 p-2 rounded w-full"
        >
          <option value="">-- Choose a lot --</option>
          {lots.map((lot) => (
            <option key={lot.id} value={lot.id}>
              {lot.name} (₹{lot.baseRate}/hr) — {lot.availableSlots} slots left
            </option>
          ))}
        </select>
      </div>

      {/* IoT Slots (Realtime DB - Read Only) */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Live Sensor Data (Wokwi)</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(iotSlots).map(([key, slot]) => (
            <div
              key={key}
              className={`p-4 rounded-xl text-center ${
                slot.occupied ? "bg-red-700" : "bg-green-700"
              }`}
            >
              <p className="text-lg font-bold">{key.toUpperCase()}</p>
              <p>{slot.occupied ? "Occupied" : "Free"}</p>
              <p className="text-sm text-gray-300">
                Distance: {slot.distance} cm
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Firestore Slots (Dummy Booking System) */}
      {selectedLot && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Dummy Firestore Slots</h3>
          <div className="grid grid-cols-3 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                disabled={loading}
                onClick={() =>
                  handleToggleSlot(slot.id, slot.rate, slot.isBooked)
                }
                className={`p-3 rounded-xl transition ${
                  slot.isBooked
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {slot.number}
                <div className="text-xs text-gray-300">₹{slot.rate}/hr</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {slot.isBooked ? "(Booked)" : "(Vacant)"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
