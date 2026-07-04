"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrcodeScanner = ({ active, onScan, onError }) => {
  const scannerRef = useRef(null);
  const startingRef = useRef(false);
  const cleanupInProgressRef = useRef(false);
  const callbacksRef = useRef({ onScan, onError });

  const stopScanner = async (scanner) => {
    try {
      await scanner.stop();
    } catch (_) {}

    try {
      await scanner.clear();
    } catch (_) {}
  };

  useEffect(() => {
    callbacksRef.current = { onScan, onError };
  }, [onError, onScan]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    if (
      cleanupInProgressRef.current ||
      startingRef.current ||
      scannerRef.current
    ) {
      return undefined;
    }

    const mountNode = document.getElementById("legacy-qr-reader");
    if (mountNode) {
      mountNode.innerHTML = "";
    }

    startingRef.current = true;

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

          scannerRef.current = null;
          startingRef.current = false;

          callbacksRef.current.onScan(decodedText);
        },
      )
      .catch((error) => {
        scannerRef.current = null;
        startingRef.current = false;
        callbacksRef.current.onError(
          error?.message
            ? `Unable to start camera: ${error.message}`
            : "Unable to start camera.",
        );
      });

    return () => {
      const activeScanner = scannerRef.current;
      scannerRef.current = null;
      startingRef.current = false;

      if (!activeScanner) {
        return;
      }

      cleanupInProgressRef.current = true;
      void stopScanner(activeScanner).finally(() => {
        cleanupInProgressRef.current = false;
      });
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return <div id="legacy-qr-reader" className="h-full min-h-[380px] w-full" />;
};

export default Html5QrcodeScanner;