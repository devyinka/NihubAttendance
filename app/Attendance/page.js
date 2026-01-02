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
import Scroll from "@/public/src/components/scroll";
import { Attendancecontex } from "@/public/src/components/Attendancepagecomponents/Attendancecontex";
import { useContext } from "react";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";

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

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!selectedeventid) return; // Don't fetch if no event selected

        const response = await axios.get(`${API}/GetDailyAttendanceInfo`, {
          params: {
            eventid: selectedeventid,
            trackid: selectedtrackid || undefined,
          },
        });
        const data = response.data;
        setstudentinfo(data.data);
      } catch (error) {
        seterror("unable to find student record", error);
      }
    };
    fetchStudentData();
  }, [selectedeventid, selectedtrackid]);

  const present = studentinfo.filter(
    (data) => data.student_attendance_status === "present"
  );
  const Absent =
    studentinfo.length > present.length
      ? studentinfo.length - present.length
      : present.length - studentinfo.length;
  const Attendancerate = (present.length / studentinfo.length) * 100;

  const handlelogout = () => {
    Navigation.push("./");
  };

  //to navigate to Attendance marking page once the button is click
  const handleAttendancepage = (change) => {
    Navigation.push("./Attendance");
    setbutton(change);
  };

  //to navigate to create page once the button is click
  const handlecreatepage = (change) => {
    Navigation.push("./AddEvent");
    setbutton(change);
  };

  //to navigate to manageevent page once the button is click
  const handlemanagepage = (change) => {
    Navigation.push("./ManageEvent");
    setbutton(change);
  };

  // to navigate to subadmin page once the button is click
  const handlesubadmnpage = (change) => {
    Navigation.push("./subadmin");
    setbutton(change);
  };

  const markallstudentpresent = async () => {
    const updated = studentinfo.map((student) => ({
      ...student,
      student_attendance_status: "present",
    }));

    // setstudentinfo(updated);

    try {
      const response = await axios.post(`${API}/MarkAllPresent`, {
        eventid: selectedeventid,
        trackid: selectedtrackid || undefined,
      });

      if (response.data && response.data.message) {
        // Optionally update local state if needed
        setstudentinfo(updated);
      }
    } catch (error) {
      seterror("unable to mark the attendance");
    }
  };

  const showmodalformarkallconfirrmation = () => {
    setshowmodal(true);
  };

  const confirmMarkAllPresent = () => {
    markallstudentpresent();
    setshowmodal(false);
  };

  const modalcancle = () => {
    setshowmodal(false);
  };

  const NavigateToScanner = () => {
    Navigation.push("./Scanner");
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
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
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
      <div className={style.container}>
        <div className={style.Titleandlogoutcontainer}>
          <div className={style.title}>Admin Dashboard</div>
          <div>
            <button className={style.logoutbox} onClick={handlelogout}>
              <Image
                src="/logout.svg"
                width={14}
                height={14}
                alt="logouticon"
              />
              <div className={style.logout}> logout </div>
            </button>
          </div>
        </div>
        <h4 className={style.subtitle}>
          Manage events, attendance, and sub-admin requests.
        </h4>
      </div>
      {Role == "Admin" ? (
        <div className={style.buttonscontainer}>
          <button
            className={button == "create" ? style.Active : ""}
            onClick={() => handlecreatepage("create")}
          >
            {" "}
            Create events
          </button>
          <button
            className={button == "manage" ? style.Active : ""}
            onClick={() => handlemanagepage("manage")}
          >
            Manage events
          </button>
          <button
            className={button == "Attendance" ? style.Active : ""}
            onClick={() => handleAttendancepage("Attendance")}
          >
            Attendance
          </button>
          <button
            className={button == "subadmin" ? style.Active : ""}
            onClick={() => handlesubadmnpage("subadmin")}
          >
            Sub-Admins
          </button>
        </div>
      ) : (
        <div className={style.buttonscontainer}>
          <button
            className={button == "create" ? style.Active : ""}
            onClick={() => handlecreatepage("create")}
          >
            {" "}
            Create events
          </button>
          <button
            className={button == "manage" ? style.Active : ""}
            onClick={() => handlemanagepage("manage")}
          >
            Manage events
          </button>
          <button
            className={button == "Attendance" ? style.Active : ""}
            onClick={() => handleAttendancepage("Attendance")}
          >
            Attendance
          </button>
        </div>
      )}
      <Scroll>
        <div className={style.box}>
          <div className={style.scan}>
            <h3 className={style.takeattendance}>Take attendance</h3>
            <button className={style.scan1} onClick={NavigateToScanner}>
              scan QR Code
            </button>
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
              mark all present
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
            Are you sure you want to mark them all present
          </h2>
          <button
            onClick={confirmMarkAllPresent}
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
