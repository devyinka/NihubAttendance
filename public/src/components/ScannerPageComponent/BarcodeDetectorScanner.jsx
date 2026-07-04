"use client";

import { useEffect, useRef, useState } from "react";

const BarcodeDetectorScanner = ({ active, onScan, onError, onFallbackToLegacy }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const callbacksRef = useRef({ onScan, onError });

  useEffect(() => {
    callbacksRef.current = { onScan, onError };
  }, [onError, onScan]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    let cancelled = false;

    const stopScanner = async () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const startScanner = async () => {
      if (typeof window === "undefined" || !("BarcodeDetector" in window)) {
        await stopScanner();
        onFallbackToLegacy?.();
        return;
      }

      try {

        const supportedFormats =
          typeof window.BarcodeDetector.getSupportedFormats === "function"
            ? await window.BarcodeDetector.getSupportedFormats()
            : [];

        const preferredFormats = supportedFormats.length
          ? supportedFormats
          : ["qr_code"];

        detectorRef.current = new window.BarcodeDetector({
          formats: preferredFormats,
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) {
          callbacksRef.current.onError("Scanner element is not ready.");
          await stopScanner();
          return;
        }

        video.srcObject = stream;
        await video.play();

        const scanFrame = async () => {
          if (cancelled || !videoRef.current || !detectorRef.current) {
            return;
          }

          if (videoRef.current.readyState >= 2) {
            try {
              const barcodes = await detectorRef.current.detect(videoRef.current);
              if (barcodes.length > 0) {
                const decodedText = barcodes[0]?.rawValue;
                if (decodedText) {
                  await stopScanner();
                  callbacksRef.current.onScan(decodedText);
                  return;
                }
              }
            } catch (error) {
              await stopScanner();
              callbacksRef.current.onError(
                error?.message
                  ? `Unable to detect barcode: ${error.message}`
                  : "Unable to detect barcode.",
              );
              return;
            }
          }

          animationFrameRef.current = requestAnimationFrame(scanFrame);
        };

        animationFrameRef.current = requestAnimationFrame(scanFrame);
      } catch (error) {
        await stopScanner();
        if (!cancelled) {
          onFallbackToLegacy?.();
        }
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      detectorRef.current = null;
      stopScanner();
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
        Scanning...
      </div>
    </div>
  );
};

export default BarcodeDetectorScanner;