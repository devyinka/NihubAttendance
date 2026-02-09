"use client";
import React from "react";
import Image from "next/image";
import style from "./header.module.css";
const Header = ({ info }) => {
  return (
    <div className={style.Header}>
      <div className={style.logo}>
        <Image src="/logo.png" width={20} height={20} alt="logo" />
        <h6 className={style.logofont}>NIHUB Events </h6>
      </div>
      <div className=" bg-white rounded-lg px-1 mr-1">
        <button className={style.logofont}> {info}</button>
      </div>
    </div>
  );
};

export default Header;
