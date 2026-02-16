"use client";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex h-[50px] items-center justify-between bg-white px-4 py-0 flex-shrink-0">
      <div className="flex h-[28px] w-[153.906px] items-center gap-2">
        <Image
          src="/logo.png"
          alt=""
          width={20}
          height={20}
          style={{ background: "rgba(159, 118, 216, 80)" }}
        />
        <h6 className="font-arial text-sm font-normal text-black">
          NIHUB Events{" "}
        </h6>
      </div>
    </div>
  );
};

export default Header;
