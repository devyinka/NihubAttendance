"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import style from "./NavigationBar.module.css";

const NavigationBar = ({ activeButton, setActiveButton }) => {
  const pathname = usePathname();
  const { Role } = useContext(Rolecontex);

  const isActive = (path) => {
    if (path === "create") return pathname === "/AddEvent";
    if (path === "manage") return pathname === "/ManageEvent";
    if (path === "Attendance") return pathname === "/Attendance";
    if (path === "subadmin") return pathname === "/subadmin";
    return false;
  };

  const getPath = (button) => {
    const paths = {
      create: "/AddEvent",
      manage: "/ManageEvent",
      Attendance: "/Attendance",
      subadmin: "/subadmin",
    };
    return paths[button] || "/";
  };

  return (
    <div className={style.buttonscontainer}>
      <Link
        href="/AddEvent"
        className={isActive("create") ? style.Active : ""}
        onClick={() => setActiveButton && setActiveButton("create")}
        prefetch={true}
      >
        Create events
      </Link>
      <Link
        href="/ManageEvent"
        className={isActive("manage") ? style.Active : ""}
        onClick={() => setActiveButton && setActiveButton("manage")}
        prefetch={true}
      >
        Manage events
      </Link>
      <Link
        href="/Attendance"
        className={isActive("Attendance") ? style.Active : ""}
        onClick={() => setActiveButton && setActiveButton("Attendance")}
        prefetch={true}
      >
        Attendance
      </Link>
      {Role === "Admin" && (
        <Link
          href="/subadmin"
          className={isActive("subadmin") ? style.Active : ""}
          onClick={() => setActiveButton && setActiveButton("subadmin")}
          prefetch={true}
        >
          Sub-Admins
        </Link>
      )}
    </div>
  );
};

export default NavigationBar;
