import React, { useEffect, useState } from "react";
import { getParkingLots, bookSlot } from "../firebase";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

export default function SelectSlot() {
  const [user, setUser] = useState(null);
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Track logged-in user
  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  // 🅿️ Load parking lots once
  useEffect(() => {
    const loadLots = async () => {
      const data = await getParkingLots();
      setLots(data);
    };
    loadLots();
  }, []);

  // ⚡ Realtime slots listener for the selected lot
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
      (error) => {
        console.error("❌ Realtime error:", error);
      }
    );

    return () => unsub();
  }, [selectedLot]);

  // 🏙️ Handle selecting a parking lot
  const handleLotSelect = (lotId) => {
    setSelectedLot(lotId);
  };

  // 🚗 Handle booking slot
  const handleBook = async (slotId, rate) => {
    if (!user) return alert("Please login first.");
    setLoading(true);
    try {
      await bookSlot(user.uid, selectedLot, slotId, rate);
      alert("✅ Slot booked successfully!");
    } catch (err) {
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
          onChange={(e) => handleLotSelect(e.target.value)}
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

      {/* Realtime Slots Display */}
      {selectedLot && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Available Slots</h3>
          <div className="grid grid-cols-3 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.id}
                disabled={slot.isBooked || loading}
                onClick={() => handleBook(slot.id, slot.rate)}
                className={`p-3 rounded-xl transition ${
                  slot.isBooked
                    ? "bg-red-700 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {slot.number}
                <div className="text-xs text-gray-300">₹{slot.rate}/hr</div>
                {slot.isBooked && (
                  <div className="text-[10px] text-gray-400 mt-1">(Booked)</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
