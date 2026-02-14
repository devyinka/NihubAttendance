"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./Attendance.module.css";
import Header from "@/public/src/components/AddEventPageComponents/header";
import { useEffect, useState } from "react";
import Trackchoice from "@/public/src/components/Attendancepagecomponents/Trackchoice";
import Search from "@/public/src/components/Attendancepagecomponents/Searchinput";
import Attendanceinfo from "@/public/src/components/Attendancepagecomponents/Attendanceinfo.card";
import AdminDashboardLayout from "@/public/src/GeneralNavComponent";
import Scroll from "@/public/src/components/scroll";
import { Attendancecontex } from "@/public/src/components/Attendancepagecomponents/Attendancecontex";
import { useContext } from "react";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import Link from "next/link";
import {
  useDailyAttendance,
  useMarkAllPresent,
  useAttendanceExport,
  useDeleteStudentsByEventAndTrack,
} from "@/app/hooks/useAttendance";

const Attendance = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const Navigation = useRouter();

  const { Role } = useContext(Rolecontex);
  const {
    selectedtrackid,
    selectedeventid,
    error,
    seterror,
    studentinfo,
    setstudentinfo,
  } = useContext(Attendancecontex);

  let [button, setbutton] = useState("Attendance");
  const [events, setevents] = useState("");
  const [search, setsearch] = useState("");
  const [showmodal, setshowmodal] = useState(false);

  // React Query hooks
  const {
    data: attendanceData,
    isLoading,
    error: queryError,
  } = useDailyAttendance(selectedeventid, selectedtrackid);
  const markAllPresentMutation = useMarkAllPresent();
  const exportAttendanceMutation = useAttendanceExport();
  const deleteStudentsMutation = useDeleteStudentsByEventAndTrack();

  // Sync React Query data with context
  useEffect(() => {
    if (attendanceData) {
      setstudentinfo(attendanceData);
    }
    if (queryError) {
      seterror("Unable to find student record");
    }
  }, [attendanceData, queryError, setstudentinfo, seterror]);

  const present = studentinfo.filter(
    (data) => data.student_attendance_status === "present",
  );
  const Absent =
    studentinfo.length > present.length
      ? studentinfo.length - present.length
      : present.length - studentinfo.length;
  const Attendancerate = (present.length / studentinfo.length) * 100;
  const Deleteallstudentintrackandevent = async () => {
    try {
      await deleteStudentsMutation.mutateAsync({
        eventid: selectedeventid,
        trackid: selectedtrackid || undefined,
      });
      seterror("");
      // Data will be automatically refetched by React Query
    } catch (error) {
      seterror("Unable to delete the students");
    }
  };

  const showmodalformarkallconfirrmation = () => {
    setshowmodal(true);
  };

  const confirmdeleteallstudentintrackandevent = () => {
    Deleteallstudentintrackandevent();
    setshowmodal(false);
  };

  const modalcancle = () => {
    setshowmodal(false);
  };

  const downloadBroadsheet = async () => {
    try {
      const response = await axios.get(
        `${API}/DownloadAttendanceBroadsheetPDF`,
        {
          params: {
            eventid: selectedeventid,
            trackid: selectedtrackid || undefined,
          },
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "attendance_broadsheet.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      seterror("Unable to download broadsheet");
    }
  };

  return (
    <div>
      <Header info="Take attendance" />
      <AdminDashboardLayout
        role={Role}
        activeButton={button}
        setActiveButton={setbutton}
      />
      <Scroll>
        <div className={style.box}>
          <div className={style.scan}>
            <h3 className={style.takeattendance}>Take attendance</h3>
            <Link href="/Scanner" className={style.scan1} prefetch={true}>
              scan QR Code
            </Link>
          </div>
          <div className={style.headercontainer}>
            <div style={{ display: "flex", flex: "4%" }}>
              <Trackchoice
                label="Select event"
                value={events}
                setValue={setevents}
              />
            </div>
            <div style={{ display: "flex", flex: "4%" }}>
              <Search
                type="text"
                label="search students"
                value={search}
                setValue={setsearch}
              />
            </div>
            <button
              className={style.button}
              onClick={showmodalformarkallconfirrmation}
            >
              {" "}
              Delete Students
            </button>
            <button className={style.download} onClick={downloadBroadsheet}>
              <Image src="/download.svg" alt="" width={10} height={10} />
            </button>
          </div>

          <div className={style.studentstat}>
            <div className={style.info}>
              <h2>Total Register</h2>
              <h2 style={{ textAlign: "center" }}>{studentinfo.length} </h2>
            </div>
            <div className={style.info}>
              <h2 style={{ color: "lightgreen" }}>present</h2>
              <h2 style={{ textAlign: "center" }}>{present.length}</h2>
            </div>
            <div className={style.info}>
              <h2 style={{ color: "red" }}>Absent</h2>
              <h2 style={{ textAlign: "center" }}>{Absent}</h2>
            </div>
            <div className={style.info}>
              <h2>Attendance Rate</h2>
              <h2 style={{ textAlign: "center" }}>
                {Attendancerate ? Attendancerate : 0} %
              </h2>
            </div>
          </div>
          <div className={style.studentdata}>
            <div className={style.subcontainer}>
              <span className={style.matric}>Matric Number</span>
              <span className={style.event}>Event</span>
              <span className={style.event}>Track</span>
              <span className={style.satus}>Status</span>
            </div>
            <hr className={style.hr} />
            <Attendanceinfo search={search} />
          </div>
        </div>
      </Scroll>

      {showmodal && (
        <div className={style.confirmdelete}>
          <h2 className={style.warning}>
            {" "}
            Are you sure you want to delete all the students in this track? This
            action cannot be undone.{" "}
          </h2>
          <button
            onClick={confirmdeleteallstudentintrackandevent}
            className={style.deletebutton}
          >
            Yes
          </button>
          <button onClick={modalcancle} className={style.deletebutton}>
            NO
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;
