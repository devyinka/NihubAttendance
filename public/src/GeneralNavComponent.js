"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboardLayout({
  role,
  activeButton,
  setActiveButton,
  children,
}) {
  const router = useRouter();

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

  const handleLogout = () => router.push("./");

  return (
    <div className="bg-white">
      {/* Header */}
      <div className=" mx-4 my-6 flex justify-between items-center  border-b border-gray-200">
        <h1 className="text-[#7741C3] font-bold text-sm lg:text-2xl">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#7741C3] text-sm hover:text-purple-700 lg:text-xl"
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

      {/* Page content */}
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}
