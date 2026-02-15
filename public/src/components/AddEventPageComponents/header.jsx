"use client";
import React from "react";
import Image from "next/image";
import style from "./header.module.css";
const Header = ({ info }) => {
  return (
    <div className={`${style.Header} fixed top-0 left-0 right-0 z-50 w-full`}>
      <div className={style.logo}>
        <Image src="/logo.png" alt="" width={20} height={20} />
        <h6 className={style.logofont}>NIHUB Events </h6>
      </div>
      <div className={style.explore}>
        <button className={style.logofont}> {info}</button>
      </div>
    </div>
  );
};

export default Header;
