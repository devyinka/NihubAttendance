"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useMarkAttendance } from "@/app/hooks/useAttendance";

import Header from "@/public/src/components/AdminLoginpageComponents/header";
import { Attendancecontex } from "@/public/src/components/Attendancepagecomponents/Attendancecontex";
import InitialScannerScreen from "@/public/src/components/ScannerPageComponent/Initialscanner";
import ActiveScannerScreen from "@/public/src/components/ScannerPageComponent/Activescannerscreen";

import style from "./scanner.module.css";
import ScannerNav from "@/public/src/ScannerNav";

const Scanner = () => {
  const { selectedtrackid, selectedeventid } = useContext(Attendancecontex);
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [scannerError, setScannerError] = useState("");
  const [qrActive, setQrActive] = useState(false);
  const [scannerMode, setScannerMode] = useState("native");

  const [studentInfo, setStudentInfo] = useState({
    student_name: "",
    student_matricnumber: "",
    student_imageurl: "",
    markedAt: null,
    alreadyMarked: false,
  });

  // const scannerRef = useRef(null);

  // React Query mutation for marking attendance
  const markAttendanceMutation = useMarkAttendance();
  const loading = markAttendanceMutation.isPending;

  const handleLogout = () => router.push("/");

  const handleSimulate = () => {
    resetStatus();
    setScannerError("");
    setScannerMode("native");
    setQrActive(true);
  };

  const handleGoBack = () => {
    resetStatus();
    setScannerError("");
    setScannerMode("native");
    setQrActive(false);
  };

  const handleNativeFallback = () => {
    resetStatus();
    setScannerError("");
    setScannerMode("legacy");
  };

  const resetStatus = () => {
    setMessage("");
    setError("");
  };

  const handleScannerError = (messageText) => {
    setScannerError(messageText);
  };

  const handleScan = async (decodedText) => {
    if (loading) return;

    resetStatus();
    setScannerError("");

    try {
      const response = await markAttendanceMutation.mutateAsync({
        qrCodeData: decodedText,
        eventid: selectedeventid,
        trackid: selectedtrackid,
      });

      setMessage(response?.message || "Attendance marked successfully");
      setStudentInfo({
        student_name: response?.data?.student_name || "",
        student_matricnumber: response?.data?.student_matricnumber || "",
        student_imageurl: response?.data?.student_imageurl || "",
        markedAt: response?.data?.markedAt || null,
        alreadyMarked: response?.alreadyMarked || false,
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Scan failed");
    }
  };

  return (
    <div>
      <Header info="Scanner" />
      <ScannerNav />
      {!qrActive ? (
        <InitialScannerScreen onStart={handleSimulate} />
      ) : (
        <ActiveScannerScreen
          message={message}
          error={error}
          loading={loading}
          studentInfo={studentInfo}
          onClear={handleGoBack}
          scannerMode={scannerMode}
          onScan={handleScan}
          scannerError={scannerError}
          onScannerError={handleScannerError}
          onNativeFallback={handleNativeFallback}
        />
      )}
    </div>
  );
};

export default Scanner;
