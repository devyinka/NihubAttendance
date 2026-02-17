import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function ScannerNav() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.push("./");
  };

  return (
    <div className="fixed top-[40px] left-0 right-0 z-30 bg-white w-full">
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
        Manage events, attendance, and sub-admin requests.{" "}
      </p>
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
