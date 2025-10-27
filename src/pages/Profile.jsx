import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  loginWithGoogle,
  logout,
  updateVehicleInfo,
} from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  serverTimestamp,
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
    carNumbers: [""],
    vehicleType: "2-wheeler",
  });

  // 🔐 Auth listener + ensure Firestore doc
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
            carNumbers: [],
            vehicleType: "2-wheeler",
            balance: 0,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        }

        // 👂 Realtime updates
        const unsubUser = onSnapshot(userRef, (docSnap) => {
          const data = docSnap.data();
          if (data) {
            setUserData(data);
            setForm({
              phone: data.phone || "",
              carNumbers: data.carNumbers?.length ? data.carNumbers : [""],
              vehicleType: data.vehicleType || "2-wheeler",
            });
          }
        });

        // 🧾 Transactions (optional)
        const txRef = collection(db, "users", currentUser.uid, "transactions");
        const txSnap = await getDocs(txRef);
        const txList = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTransactions(txList);

        return () => unsubUser();
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🧭 Fetch nearest parking lot (only when user clicks)
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
      await updateVehicleInfo(user.uid, form.carNumbers, form.vehicleType);
      await updateDoc(doc(db, "users", user.uid), {
        phone: form.phone,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile. Check console for details.");
    }
  };

  if (!user) {
    // 🔑 Login screen
    return (
      <div className="flex flex-col gap-3 p-6 max-w-md mx-auto text-white shadow-md rounded-2xl min-h-screen justify-center">
        <h2 className="text-2xl font-bold text-center mb-2">
          Smart Parking Login
        </h2>

        <input
          type="text"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-gray-700 bg-transparent p-2 rounded text-white"
        />

        <label className="font-medium">Car Number Plates:</label>
        {form.carNumbers.map((car, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Car ${idx + 1}`}
            value={car}
            onChange={(e) => {
              const newCars = [...form.carNumbers];
              newCars[idx] = e.target.value;
              setForm({ ...form, carNumbers: newCars });
            }}
            className="border border-gray-700 bg-transparent p-2 rounded mb-1 text-white"
          />
        ))}

        <button
          onClick={() =>
            setForm({ ...form, carNumbers: [...form.carNumbers, ""] })
          }
          className="underline text-sm"
        >
          + Add another car
        </button>

        <label className="font-medium">Vehicle Type:</label>
        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
          className="border border-gray-700 bg-transparent p-2 rounded text-white"
        >
          <option value="2-wheeler">2 Wheeler</option>
          <option value="3-wheeler">3 Wheeler</option>
          <option value="4-wheeler">4 Wheeler</option>
        </select>

        <button
          onClick={() => loginWithGoogle(form)}
          className="bg-green-600 text-white p-2 rounded mt-3 hover:bg-green-700 flex items-center justify-center space-x-2"
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
            <strong>Balance:</strong> {userData?.balance}
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

          <div>
            <strong>Vehicle Type:</strong>{" "}
            {isEditing ? (
              <select
                value={form.vehicleType}
                onChange={(e) =>
                  setForm({ ...form, vehicleType: e.target.value })
                }
                className="border bg-transparent border-gray-700 p-1 rounded"
              >
                <option value="2-wheeler">2 Wheeler</option>
                <option value="3-wheeler">3 Wheeler</option>
                <option value="4-wheeler">4 Wheeler</option>
              </select>
            ) : (
              userData?.vehicleType || "-"
            )}
          </div>

          <div>
            <strong>Car Numbers:</strong>
            {isEditing ? (
              <div className="flex flex-col gap-1 mt-1">
                {form.carNumbers.map((car, idx) => (
                  <input
                    key={idx}
                    value={car}
                    onChange={(e) => {
                      const newCars = [...form.carNumbers];
                      newCars[idx] = e.target.value;
                      setForm({ ...form, carNumbers: newCars });
                    }}
                    className="border bg-transparent border-gray-700 p-1 rounded"
                    placeholder={`Car ${idx + 1}`}
                  />
                ))}
                <button
                  onClick={() =>
                    setForm({
                      ...form,
                      carNumbers: [...form.carNumbers, ""],
                    })
                  }
                  className="underline text-sm text-[#00D4AA]"
                >
                  + Add another car
                </button>
              </div>
            ) : (
              <ul className="list-disc list-inside">
                {userData?.carNumbers?.map((c, i) => (
                  <li key={i}>{c}</li>
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
                <span className="text-[#00D4AA]">
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
