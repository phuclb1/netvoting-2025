"use client";
import { useState } from "react";
import QRScanner from "@/components/shared/QRScanner";

export default function QRCodePage() {
  const [qrResult, setQrResult] = useState("");

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
      <QRScanner onScan={(result) => setQrResult(result)} />
      {qrResult && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          Scanned: {qrResult}
        </div>
      )}
    </div>
  );
}