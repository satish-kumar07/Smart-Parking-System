import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const PARKING_LOTS = [
  { id: 1, name: "City Center Lot" },
  { id: 2, name: "Green Park Lot" },
  { id: 3, name: "Cyber City Lot" },
  { id: 4, name: "Airport Lot" },
  { id: 5, name: "Noida Sector 18 Lot" },
];

export default function GenerateQRCodes() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Parking Lot QR Codes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {PARKING_LOTS.map((lot) => {
          // You can encode either a URL or JSON — both work with ScanQR
          const qrValue = JSON.stringify({ lotId: lot.id, name: lot.name });
          // Or: const qrValue = `https://smartparking.app/scan?lotId=${lot.id}`;

          return (
            <div
              key={lot.id}
              className="bg-[#111] p-4 rounded-2xl text-center shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-3">{lot.name}</h3>
              <div className="bg-white p-3 rounded-xl inline-block">
                <QRCodeCanvas
                  value={qrValue}
                  size={160}
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Lot ID: {lot.id}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
