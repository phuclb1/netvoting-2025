"use client";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";



const QRScanner = ({ onScan }: {onScan: (t: string) => void}) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 400, height: 400 },

    }, false);

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear(); // Stop scanning after a successful scan
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.warn("Error clearing scanner:", error);
      });
    };
  }, [onScan]);

  return (
    <div className="flex flex-col w-[80vh]">
      <div className="flex flex-col" id="qr-reader" ref={scannerRef} />
      </div>
  );
};

export default QRScanner;