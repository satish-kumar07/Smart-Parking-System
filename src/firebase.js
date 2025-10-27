import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDjZsbrzXOCjwykcLNp1B8GqrCZPdI8XE8",
  authDomain: "smart-parking-1289.firebaseapp.com",
  projectId: "smart-parking-1289",
  storageBucket: "smart-parking-1289.firebasestorage.app",
  messagingSenderId: "123647550631",
  appId: "1:123647550631:web:d807c1dd0f6bbd97756782",
  measurementId: "G-SGBRYRBJ7L",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

/* ======================================================
   👤 USER AUTHENTICATION & FIRESTORE USER MANAGEMENT
   ====================================================== */

/**
 * 🔐 Google Sign-In + Auto Create Firestore User
 */
export const loginWithGoogle = async (extraData = {}) => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await ensureUserDocument(user, extraData);

  return user;
};

/**
 * 🧾 Ensure Firestore user doc exists
 */
export const ensureUserDocument = async (user, extraData = {}) => {
  if (!user?.uid) return null;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || extraData.name || "Unnamed User",
      email: user.email || "",
      phone: extraData.phone || "",
      carNumbers: extraData.carNumbers || [],
      vehicleType: extraData.vehicleType || "",
      balance: 0,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  }

  return getDoc(userRef);
};

/**
 * 🚗 Update vehicle info
 */
export const updateVehicleInfo = async (uid, carNumbers, vehicleType) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    carNumbers,
    vehicleType,
    lastUpdated: serverTimestamp(),
  });
};

/**
 * 💰 Add Balance
 */
export const addBalance = async (uid, amount) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    balance: increment(amount),
  });
};

/**
 * 👤 Log out user
 */
export const logout = () => signOut(auth);

/* ======================================================
   🅿️ PARKING LOTS & SLOT MANAGEMENT FUNCTIONS
   ====================================================== */

/** 🅿️ Fetch all parking lots */
export const getParkingLots = async () => {
  const lotsSnap = await getDocs(collection(db, "parkingLots"));
  return lotsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** 🚗 Fetch all slots for a specific parking lot */
export const getSlotsForLot = async (lotId) => {
  const slotsSnap = await getDocs(
    collection(db, "parkingLots", lotId, "slots")
  );
  return slotsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/** ✅ Book a slot */
export const bookSlot = async (uid, lotId, slotId, amount) => {
  const slotRef = doc(db, "parkingLots", lotId, "slots", slotId);
  const lotRef = doc(db, "parkingLots", lotId);
  const userRef = doc(db, "users", uid);

  // Fetch current slot
  const slotSnap = await getDoc(slotRef);
  if (!slotSnap.exists()) throw new Error("Slot not found");
  if (slotSnap.data().isBooked) throw new Error("Slot already booked");

  // 🟢 Mark slot as booked
  await updateDoc(slotRef, {
    isBooked: true,
    bookedBy: uid,
    bookedAt: serverTimestamp(),
  });

  // 🟡 Decrease availableSlots count
  await updateDoc(lotRef, {
    availableSlots: increment(-1),
  });

  // 💸 Deduct from user balance
  await updateDoc(userRef, {
    balance: increment(-amount),
  });

  // 🧾 Log transaction
  await setDoc(doc(collection(db, "users", uid, "transactions")), {
    description: `Booked slot ${slotId} in lot ${lotId}`,
    amount: -amount,
    date: new Date().toLocaleString(),
    createdAt: serverTimestamp(),
  });

  return true;
};

/**
 * ♻️ Unbook slot (optional — for admin or after time expires)
 */
export const unbookSlot = async (lotId, slotId) => {
  const slotRef = doc(db, "parkingLots", lotId, "slots", slotId);
  const lotRef = doc(db, "parkingLots", lotId);

  await updateDoc(slotRef, {
    isBooked: false,
    bookedBy: null,
    bookedAt: null,
  });

  await updateDoc(lotRef, {
    availableSlots: increment(1),
  });
};

/* ======================================================
   🧩 EXPORT FIREBASE INSTANCES
   ====================================================== */
export { auth, provider, db };
