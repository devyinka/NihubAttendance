"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/public/src/components/AddEventPageComponents/header";
import { useEffect, useState } from "react";
import Trackchoice from "@/public/src/components/Attendancepagecomponents/Trackchoice";
import Search from "@/public/src/components/Attendancepagecomponents/Searchinput";
import Attendanceinfo from "@/public/src/components/Attendancepagecomponents/Attendanceinfo.card";
import AdminDashboardLayout from "@/public/src/GeneralNavComponent";
import { Attendancecontex } from "@/public/src/components/Attendancepagecomponents/Attendancecontex";
import { useContext } from "react";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import Link from "next/link";
import {
  useDailyAttendance,
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
      <Header info="Attendance" />
      <AdminDashboardLayout
        role={Role}
        activeButton={button}
        setActiveButton={setbutton}
      >
        <div className="mt-2 pt-0.8 mx-2 mb-0.5 rounded-lg border border-gray-200 bg-white pl-2">
          <div className="flex justify-between py-2">
            <h3 className="font-mono text-sm text-[#7741C3] text-bold">
              Take attendance
            </h3>
            <Link
              href="/Scanner"
              className="pr-1 rounded-md bg-[#7741C3] text-white px-2 py-1 text-xs mr-2"
              prefetch={true}
            >
              scan QR Code
            </Link>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-2 w-full mb-2  items-center lg:items-end pr-2">
            {/* Select Event */}
            <div className="min-w-[125px] flex-1 sm:flex-none lg:flex-1">
              <Trackchoice
                label="Select event"
                value={events}
                setValue={setevents}
              />
            </div>

            {/* Search Students */}
            <div className="min-w-[125px] flex-1 sm:flex-none lg:flex-1">
              <Search
                type="text"
                label="search students"
                value={search}
                setValue={setsearch}
              />
            </div>

            {/* Buttons wrapper - Side by side Delete & Download */}
            <div className="flex gap-2 w-full sm:w-auto lg:flex-1 lg:h-auto">
              {/* Delete Students Button */}
              <button
                className="flex-1 sm:flex-none lg:flex-1 lg:h-10 border border-gray-300 rounded-md px-3 py-1 text-sm text-white bg-[#7741C3] flex justify-center items-center whitespace-nowrap"
                onClick={showmodalformarkallconfirrmation}
              >
                Delete Students
              </button>

              {/* Download Button */}
              <button
                className="flex items-center justify-center w-fit lg:w-auto lg:h-10 p-1 border border-gray-300 rounded-md bg-[#7741C3]"
                onClick={downloadBroadsheet}
              >
                <Image
                  src="/download.svg"
                  alt="download"
                  width={12}
                  height={12}
                />
              </button>
            </div>
          </div>

          {/* Stats Container - Responsive Grid */}
          <div className="bg-[#7741C3] ml-0 mr-1 mt-2 p-4 rounded-lg mb-4 text-white">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Register */}
              <div className="text-center border-r border-white lg:border-r-1">
                <h2 className="text-sm font-mono mb-1">Total Register</h2>
                <h2 className="text-lg font-bold text-center">
                  {studentinfo.length}
                </h2>
              </div>

              {/* Present */}
              <div className="text-center  lg:border-r-1">
                <h2 className="text-sm font-mono mb-1 text-lime-300">
                  present
                </h2>
                <h2 className="text-lg font-bold text-center text-lime-300">
                  {present.length}
                </h2>
              </div>

              {/* Absent */}
              <div className="text-center border-r border-white lg:border-r-1">
                <h2 className="text-sm font-mono mb-1 text-red-300">Absent</h2>
                <h2 className="text-lg font-bold text-center text-red-300">
                  {Absent}
                </h2>
              </div>

              {/* Attendance Rate */}
              <div className="text-center">
                <h2 className="text-sm font-mono mb-1">Attendance Rate</h2>
                <h2 className="text-lg font-bold text-center">
                  {Attendancerate ? Attendancerate.toFixed(1) : 0}%
                </h2>
              </div>
            </div>
          </div>
          {/* Student Cards Section */}
          <div className="border border-gray-300 mx-1 mb-4 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-bold text-[#7741C3] mb-4">
              Student Attendance Records
            </h3>
            <Attendanceinfo search={search} />
          </div>
        </div>

        {showmodal && (
          <div className="fixed inset-0 bg-[#7741C3]/10 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-red-600 mb-2">
                Are you sure you want to delete all the students in this track?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button
                  onClick={modalcancle}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmdeleteallstudentintrackandevent}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminDashboardLayout>
    </div>
  );
};

export default Attendance;
