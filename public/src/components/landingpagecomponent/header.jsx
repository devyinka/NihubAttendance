"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = ({ info }) => {
  const Navigation = useRouter();

  const handledmin = () => {
    Navigation.push("./AdminLogin");
  };
  return (
    <div className="flex h-[20%] justify-between m-1">
      <div className="">
        <Image
          src="/logo.png"
          alt=""
          width={20}
          height={20}
          style={{ background: "rgba(159, 118, 216, 80)" }}
        />
      </div>
      <div className=" bg-[#7741C3] rounded-lg px-1 mr-1 sm:">
        <button
          className="text-xs text-white cursor-pointer"
          onClick={handledmin}
        >
          {" "}
          {info}
        </button>
      </div>
    </div>
  );
};

export default Header;
