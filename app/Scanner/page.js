"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

import Header from "@/public/src/components/AdminLoginpageComponents/header";
import { Attendancecontex } from "@/public/src/components/Attendancepagecomponents/Attendancecontex";
import InitialScannerScreen from "@/public/src/components/ScannerPageComponent/Initialscanner";
import ActiveScannerScreen from "@/public/src/components/ScannerPageComponent/Activescannerscreen";

import style from "./scanner.module.css";

const Scanner = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const { selectedtrackid, selectedeventid } = useContext(Attendancecontex);
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrActive, setQrActive] = useState(false);

  const [studentInfo, setStudentInfo] = useState({
    student_name: "",
    student_matricnumber: "",
    student_imageurl: "",
    markedAt: null,
    alreadyMarked: false,
  });

  const scannerRef = useRef(null);

  const handleLogout = () => router.push("/");

  const handleSimulate = () => {
    resetStatus();
    setQrActive(true);
  };

  const handleGoBack = () => {
    resetStatus();
    setQrActive(false);
  };

  const resetStatus = () => {
    setMessage("");
    setError("");
    setLoading(false);
  };

  const handleScan = async (decodedText) => {
    if (loading) return;

    resetStatus();
    setLoading(true);

    try {
      const Response = await axios.post(`${API}/MarkAttendance`, {
        studentid: decodedText,
        selectedeventid,
        selectedtrackid,
      });

      setMessage(Response.data?.message);
      setStudentInfo({
        student_name: Response.data?.data.student_name,
        student_matricnumber: Response.data?.data.student_matricnumber,
        student_imageurl: Response.data?.data.student_imageurl,
        markedAt: Response.data?.data.markedAt,
        alreadyMarked: Response.data?.alreadyMarked,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Scan failed");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!qrActive) return;

    const scanner = new Html5Qrcode("qr-reader");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          scanner.stop();
          handleScan(decodedText);
        }
      )
      .catch((err) => {
        setError("Unable to start camera: " + err?.message);
      });

    return () => {
      try {
        // Cleanup on unmount
        if (scanner._state !== 3) {
          scanner.stop();
        }
      } catch (_) {}
    };
  }, [qrActive]);

  return (
    <div>
      <Header info="Scanner" />
      <div className={style.container}>
        <div className={style.Titleandlogoutcontainer}>
          <div className={style.title}>Admin Dashboard</div>

          <button className={style.logoutbox} onClick={handleLogout}>
            <Image src="/logout.svg" width={14} height={14} alt="logout" />
            <div className={style.logout}> logout </div>
          </button>
        </div>
        <h4 className={style.subtitle}>
          Manage events, attendance, and sub-admin requests.
        </h4>
      </div>
      {!qrActive ? (
        <InitialScannerScreen onStart={handleSimulate} />
      ) : (
        <ActiveScannerScreen
          message={message}
          error={error}
          loading={loading}
          studentInfo={studentInfo}
          onClear={handleGoBack}
        />
      )}
    </div>
  );
};

export default Scanner;
