"use client";
import React from "react";
import Image from "next/image";
const Header = ({ info }) => {
  return (
    <div className="flex h-[50px] items-center justify-between bg-[#7741C3] px-4">
      <div className="flex h-7 w-[153.906px] items-center gap-2">
        <Image src="/logo.png" width={20} height={20} alt="logo" />
        <h6 className="font-mono text-[#7741C3]">NIHUB Events </h6>
      </div>
      <div className="mr-1 rounded-lg bg-white px-1">
        <button className="font-mono text-[#7741C3]"> {info}</button>
      </div>
    </div>
  );
};

export default Header;
