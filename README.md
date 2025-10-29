# 🚗 Smart Parking — Web App

> A next-gen smart parking platform that merges IoT, AI, and cloud to make parking effortless.  

![Vite](https://img.shields.io/badge/Vite-563D7C?style=for-the-badge&logo=vite&logoColor=yellow)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 🧾 Overview

**Smart Parking** is a lightweight React + Vite web app that delivers an intelligent parking experience with QR-code scanning, slot reservation, user profiles, and AI-powered number plate detection.  

It integrates **Firebase** for backend services and uses a **YOLOv8 model** for automatic vehicle number plate recognition — bridging the gap between software and real-world automation.  

---

## 🚗 Key Features

- 🧾 **QR Code Management** — Generate unique QR codes for every parking slot using the `GenerateQRCodes` page.  
- 📷 **QR Scanning** — Use your device camera to instantly check-in or check-out with the `ScanQR` feature.  
- 🅿️ **Smart Slot Selection** — Browse, select, and reserve available parking spaces in real time through the `SelectSlot` page.  
- 👤 **User Profiles** — Manage and view user data easily via Firebase Authentication and Firestore integration.  
- 🤖 **AI-Powered Number Plate Detection** — Automatically detect car number plates using a trained **YOLOv8** model and log entries directly into the database.  
- 📱 **Responsive Design** — Fully mobile-friendly interface styled with **Tailwind CSS** for a seamless experience across devices.  
- ☁️ **One-Click Deployment** — Integrated with **Vercel** for smooth, serverless deployment with minimal configuration.

---

## 🧭 How It Works

1️⃣ **Admin Panel — QR Generation**  
   The parking admin or staff generates unique QR codes for each parking slot using the `GenerateQRCodes` page.  

2️⃣ **Driver Arrival — QR Scan**  
   When a driver arrives, they scan the slot’s QR code using the `ScanQR` feature. The app instantly reads the code and fetches slot details from Firestore.  

3️⃣ **Slot Verification — Check-In / Check-Out**  
   The app verifies the scanned QR, shows real-time slot status, and allows the user to confirm check-in or check-out.  

4️⃣ **Slot Reservation — Smart Selection**  
   Through the `SelectSlot` page, users can view available slots and reserve them in advance for a smooth parking experience.  

5️⃣ **AI Camera Integration — Number Plate Detection**  
   When a car enters, the live camera feed captures the vehicle. The **YOLOv8** ML model detects the number plate and stores it securely in **Firebase Firestore**.  

6️⃣ **Data Management — Firebase Backend**  
   Firebase manages user sessions, parking logs, and real-time slot data — keeping everything synced across devices.  

---

## 🧰 Tech Stack

### 🎨 Frontend
- **React (Vite + JSX)** — Fast and modular UI development.  
- **Tailwind CSS + PostCSS** — Sleek and responsive styling.  
- **ESLint** — Ensures consistent and clean code quality.  

### ⚙️ Backend & Cloud
- **Firebase Authentication** — Secure user management.  
- **Firestore Database** — Real-time NoSQL data storage.  
- **Firebase Hosting (optional)** — Alternative to Vercel deployment.  

### 💡 Machine Learning
- **YOLOv8 Model (Ultralytics)** — Detects and extracts vehicle number plates from camera feeds.  
- **OpenCV (optional)** — Used for preprocessing or testing number plate recognition.  

### 🚀 Deployment & Tooling
- **Vercel** — Effortless build & deployment pipeline for Vite apps.  
- **Environment Variables (.env)** — Secure config management.  
- **QR Libraries** — `qrcode.react` for generation, `html5-qrcode` for scanning.  

---

## 🔥 Firebase Setup

1️⃣ **Create a Firebase Project**  
   Go to [Firebase Console](https://console.firebase.google.com) and create a project.  

2️⃣ **Enable Firestore + Authentication**  
   Use **Email/Password** or **Google Sign-In** for authentication.  

3️⃣ **Add Firebase Config to `src/firebase.js`**  
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getAuth } from "firebase/auth";

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
    ```

4️⃣ **Create a .env file** (and make sure it's in `.gitignore`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```


---
## 🚀 Deployment

### 🌐 Web App Deployment
The web application (React + Vite + Firebase) can be deployed easily using **Vercel**.

**Steps:**
1. Push your frontend code to a GitHub repository.  
2. Import the repository into [Vercel](https://vercel.com).  
3. Add your Firebase environment variables (`VITE_FIREBASE_*`) under **Project Settings → Environment Variables**.  
4. Click **Deploy** — Vercel automatically builds and hosts the app.

> 🔧 You can also deploy on **Firebase Hosting** or **Netlify** if preferred.

---

### 🤖 IoT System Deployment
The IoT module uses **ESP32 / Raspberry Pi** integrated with **sensors** and **cloud services** to collect real-time data.

**Steps:**
1. Flash the IoT firmware code onto the ESP32/Raspberry Pi using Arduino IDE or Thonny.  
2. Connect the sensors (e.g., IR, Ultrasonic, or RFID) according to the circuit diagram.  
3. Configure Wi-Fi credentials and API keys in the firmware to connect with Firebase or MQTT broker.  
4. Power up the device — data will be sent to the cloud and reflected in the dashboard automatically.  

> 💡 IoT and web modules communicate via Firebase Realtime Database, ensuring live synchronization between the hardware and web app.

---

### 🧠 Final Integration
Once both modules are active:
- The **IoT device** collects data and uploads it to Firebase.  
- The **web app** fetches and visualizes this data in real time.  
- The entire system runs smoothly on the cloud with automatic updates and scalability.

---

## Development tips & assumptions
- The app expects a lightweight Firebase backend (Auth & Firestore). If you use another backend, replace `src/firebase.js` with your API layer.
- If QR generation or scanning libraries are not installed, add one (e.g., `qrcode` / `qrcode.react` for generation, `html5-qrcode` or `qr-scanner` for scanning).
- Test camera-based features on an actual device or a browser with camera support and permissions.

## Contributing
- Fork the repo, create a feature branch, and open a pull request.
- Keep changes small and add testing instructions to the PR.

---

## 👥 Project Owners & License

### Project Team
- **Prajapati Satish Kumar** - _Lead Developer_
- **Ram gopal Reddy** - _ML/AI Engineer_
- **Abhinav Dasari** - _Frontend/IoT Developer_

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

> © 2025 Smart Parking Project Team. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ by Prajapati Satish Kumar, Ram gopal Reddy, and Abhinav Dasari</sub>
</div>

---

This README was added/updated to provide setup, deployment, and contribution guidance for the Smart Parking app. Adjust any Firebase or environment values before sharing the repo publicly.

