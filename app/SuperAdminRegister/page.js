"use client";
import { useRouter, useSearchParams } from "next/navigation";
import style from "@/app/AdminLogin/page.module.css";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import axios from "axios";
import { useState } from "react";
import Input from "@/public/src/components/AdminLoginpageComponents/Forminput";

const SuperAdminRegister = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const Navigation = useRouter();
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setloading] = useState(false);
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");

  const handlebacktologin = () => {
    // Navigation handled by Link component
  };

  const handlesubmit = async () => {
    setloading(true);
    if (!Email || !Username) {
      seterror("All fields are required");
      setsuccess("");
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }
    let response;
    try {
      response = await axios.post(`${API}/Registersuperadmin`, {
        Email,
        Username,
      });
      if (response?.data?.Error) {
        seterror(response.data.Error);
        setsuccess("");
        setTimeout(() => {
          seterror("");
        }, 4000);
      } else {
        setsuccess(response?.data?.message);
        setTimeout(() => {
          setsuccess("");
        }, 4000);
      }
    } catch (err) {
      seterror(response?.data?.Error);
      setTimeout(() => {
        seterror("");
      }, 4000);
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      <Header info={"Super Admin Register"} />
      {/* <div>
        <button className={style.backbotton} onClick={handlebacktologin}>
          Back to login
        </button>
      </div> */}
      <div className="flex items-center justify-center fixed inset-0">
        <div className="border border-[#7741c3]  w-80 md:w-120 h-85 flex items-center justify-center flex-col rounded-lg p-4 bg-white shadow-lg">
          <form
            className="lg:w-90"
            onSubmit={(e) => {
              e.preventDefault(), handlesubmit();
            }}
          >
            <Input
              type="email"
              label="Email"
              value={Email}
              setValue={setEmail}
            />
            <Input
              type="text"
              label="Username"
              value={Username}
              setValue={setUsername}
            />
            <button
              type="submit"
              className=" text-white bg-[#7741c3] font-mono text-xs font-normal mt-2 mb-1 rounded-md w-[90%] p-2 ml-5"
            >
              {!loading ? "Register" : "please wait..."}
            </button>
          </form>
          {error && (
            <p style={{ color: "red", justifySelf: "center" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "green", justifySelf: "center" }}>{success}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegister;
