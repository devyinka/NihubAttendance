"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function AdminDashboardLayout({
  role,
  activeButton,
  setActiveButton,
  children,
}) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Navigation buttons
  const buttons =
    role === "Admin"
      ? ["create", "manage", "Attendance", "subadmin"]
      : ["create", "manage", "Attendance"];

  const buttonLabels = {
    create: "Events",
    manage: "Manage",
    Attendance: "info",
    subadmin: "Admins",
  };

  const navigate = (page) => {
    setActiveButton(page);
    ("");
    const routes = {
      create: "AddEvent",
      manage: "ManageEvent",
      Attendance: "Attendance",
      subadmin: "subadmin",
    };
    router.push(`./${routes[page]}`);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.push("./");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="bg-white">
      {/* Fixed Navigation Section - starts at header height */}
      <div className="fixed top-[40px] left-0 right-0 z-30 bg-white w-full">
        {/* Header */}
        <div className=" mx-4 my-6 flex justify-between items-center  border-b border-gray-200">
          <h1 className="text-[#7741C3] font-bold text-sm lg:text-2xl">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 text-[#7741C3] text-sm hover:text-purple-700 lg:text-xl font-bold"
          >
            <Image src="/logout.svg" width={14} height={14} alt="logout" />
            logout
          </button>
        </div>

        <p className="px-8 py-2 text-[#7741C3] text-sm">
          Manage events, attendance, and sub-admin requests.
        </p>

        {/* Navigation buttons */}
        <div className="flex justify-around bg-[#7741C3] text-white rounded-xl mx-2 my-1 py-1">
          {buttons.map((btn) => (
            <button
              key={btn}
              className={`rounded-xl px-1 transition text-sm ${
                activeButton === btn
                  ? "bg-white text-[#7741C3] mx-3  lg:w-60 w-20 "
                  : "hover:bg-purple-700"
              }`}
              onClick={() => navigate(btn)}
            >
              {buttonLabels[btn]}
            </button>
          ))}
        </div>
      </div>

      {/* Page content with margin to account for fixed header */}
      <div className="pt-[280px] px-4 py-2">{children}</div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#7741C3]/10 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-bold text-red-600 mb-6">
              Are you sure you want to logout?
            </h2>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
