import React, { useState, useEffect } from "react";
import { auth, db, loginWithGoogle, logout } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { FaEdit, FaCarAlt, FaSignOutAlt } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { onAuthStateChanged } from "firebase/auth";

const PARKING_LOTS = [
  { id: 1, name: "City Center Lot", lat: 28.6139, lng: 77.209 },
  { id: 2, name: "Green Park Lot", lat: 28.5494, lng: 77.2001 },
  { id: 3, name: "Cyber City Lot", lat: 28.4944, lng: 77.088 },
  { id: 4, name: "Airport Lot", lat: 28.5562, lng: 77.1 },
  { id: 5, name: "Noida Sector 18 Lot", lat: 28.5672, lng: 77.321 },
];

// 📏 Calculate distance between two lat/lngs
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nearestLot, setNearestLot] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    phone: "",
    vehicles: [{ number: "", type: "2-wheeler" }],
  });

  // 🔐 Auth listener + realtime Firestore updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        // 🧱 Auto-create user doc if missing
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            phone: "",
            vehicles: [],
            balance: 0,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        }

        // 👂 Realtime user updates
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          const data = docSnap.data();
          if (data) {
            setUserData(data);
            setForm({
              phone: data.phone || "",
              vehicles:
                data.vehicles?.length > 0
                  ? data.vehicles
                  : [{ number: "", type: "2-wheeler" }],
            });
          }
        });

        // 🧾 Realtime transactions, newest first
        const txRef = collection(db, "users", currentUser.uid, "transactions");
        const q = query(txRef, orderBy("timestamp", "desc"));
        const unsubTx = onSnapshot(q, (txSnap) => {
          const txList = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setTransactions(txList);
        });

        // 🔥 Cleanup on unmount
        return () => {
          unsubUser();
          unsubTx();
        };
      } else {
        setUser(null);
        setUserData(null);
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🧭 Fetch nearest parking lot
  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let closest = null;
        let minDist = Infinity;

        PARKING_LOTS.forEach((lot) => {
          const dist = getDistanceKm(latitude, longitude, lot.lat, lot.lng);
          if (dist < minDist) {
            minDist = dist;
            closest = { ...lot, distance: dist };
          }
        });

        setNearestLot(closest);
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch your location.");
      }
    );
  };

  // 💾 Save changes
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        phone: form.phone,
        vehicles: form.vehicles,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile. Check console for details.");
    }
  };

  // 🔑 Login screen
  if (!user) {
    return (
      <div className="flex flex-col gap-3 p-6 max-w-md mx-auto text-white shadow-md rounded-2xl min-h-screen justify-center">
        <h2 className="text-2xl font-bold text-center mb-2">
          Smart Parking Login
        </h2>
        <p className="text-center text-gray-400">
          Sign in with Google to access your profile and manage your parking.
        </p>

        <button
          onClick={() => loginWithGoogle(form)}
          className="bg-[#00D4AA] text-white p-2 rounded mt-3 hover:bg-[#00D4AA] flex items-center justify-center space-x-2"
        >
          <IoMdLogIn size={20} />
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  // 👤 Logged-in user view
  return (
    <div className="max-w-2xl mx-auto p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Profile</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* User Details */}
      <div className="bg-[#111] p-4 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-2">User Details</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-[#00D4AA] flex items-center space-x-1"
          >
            <FaEdit />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <strong>Name:</strong> {userData?.name}
          </div>
          <div>
            <strong>Email:</strong> {userData?.email}
          </div>
          <div>
            <strong>Balance:</strong> ₹{userData?.balance || 0}
          </div>
          <div>
            <strong>Phone:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border bg-transparent border-gray-700 p-1 rounded"
              />
            ) : (
              userData?.phone || "-"
            )}
          </div>

          {/* 🚗 Vehicles */}
          <div>
            <strong>Vehicles:</strong>
            {isEditing ? (
              <div className="flex flex-col gap-2 mt-1">
                {form.vehicles.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Vehicle ${idx + 1} Number`}
                      value={v.number}
                      onChange={(e) => {
                        const newVehicles = [...form.vehicles];
                        newVehicles[idx].number = e.target.value;
                        setForm({ ...form, vehicles: newVehicles });
                      }}
                      className="border bg-transparent border-gray-700 p-1 rounded flex-1"
                    />
                    <select
                      value={v.type}
                      onChange={(e) => {
                        const newVehicles = [...form.vehicles];
                        newVehicles[idx].type = e.target.value;
                        setForm({ ...form, vehicles: newVehicles });
                      }}
                      className="border bg-transparent border-gray-700 p-1 rounded"
                    >
                      <option value="2-wheeler">2 Wheeler</option>
                      <option value="3-wheeler">3 Wheeler</option>
                      <option value="4-wheeler">4 Wheeler</option>
                    </select>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setForm({
                      ...form,
                      vehicles: [
                        ...form.vehicles,
                        { number: "", type: "2-wheeler" },
                      ],
                    })
                  }
                  className="underline text-sm text-[#00D4AA]"
                >
                  + Add another vehicle
                </button>
              </div>
            ) : (
              <ul className="list-disc list-inside mt-1">
                {userData?.vehicles?.map((v, i) => (
                  <li key={i}>
                    {v.number} — <span className="text-gray-400">{v.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-3"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Parking Recommendation */}
      <div className="bg-[#111] p-4 rounded-2xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Nearest Parking Lot</h3>
        {nearestLot ? (
          <>
            <p>
              <FaCarAlt className="inline mr-2 text-[#00D4AA]" />
              {nearestLot.name} –{" "}
              <span className="text-sm text-gray-400">
                {nearestLot.distance.toFixed(2)} km away
              </span>
            </p>
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${nearestLot.lat},${nearestLot.lng}`,
                  "_blank"
                )
              }
              className="mt-3 bg-gradient-to-r from-[#00D4AA] to-[#00B4E5] px-4 py-2 rounded hover:from-[#00C299] hover:to-[#00A3D4]"
            >
              View Route in Google Maps
            </button>
          </>
        ) : (
          <button
            onClick={handleFindNearest}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Find Nearest Lot
          </button>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-[#111] p-4 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-3">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm">No transactions found.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="border border-gray-800 rounded-lg p-3 text-sm flex justify-between"
              >
                <span>{tx.description || "Parking Session"}</span>
                <span
                  className={`${
                    tx.amount < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  ₹{tx.amount} – {tx.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
