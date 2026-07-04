"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrcodeScanner = ({ active, onScan, onError }) => {
  const scannerRef = useRef(null);
  const callbacksRef = useRef({ onScan, onError });

  useEffect(() => {
    callbacksRef.current = { onScan, onError };
  }, [onError, onScan]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const scanner = new Html5Qrcode("legacy-qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          try {
            await scanner.stop();
            await scanner.clear();
          } catch (_) {}

          callbacksRef.current.onScan(decodedText);
        },
      )
      .catch((error) => {
        callbacksRef.current.onError(
          error?.message
            ? `Unable to start camera: ${error.message}`
            : "Unable to start camera.",
        );
      });

    return () => {
      const activeScanner = scannerRef.current;
      scannerRef.current = null;

      if (!activeScanner) {
        return;
      }

      Promise.resolve(activeScanner.stop())
        .catch(() => {})
        .finally(() => {
          activeScanner.clear().catch(() => {});
        });
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return <div id="legacy-qr-reader" className="min-h-[260px] w-full" />;
};

export default Html5QrcodeScanner;