"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(119,65,195,0.14),_rgba(255,255,255,0.9)_55%)]">
      <Header info={"Super Admin Register"} />
      <div className="mx-auto flex min-h-[calc(100vh-50px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#7741c3]/30 bg-white/95 p-6 shadow-[0_20px_60px_rgba(55,24,90,0.15)] backdrop-blur">
          <div className="mb-5 text-center">
            <h2 className="text-lg font-bold text-[#7741c3]">
              Create Super Admin
            </h2>
            <p className="text-xs text-gray-500">
              Register a new super admin account.
            </p>
          </div>
          <form
            className="space-y-1"
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
              className="mt-3 w-full rounded-md bg-[#7741c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a39b0]"
            >
              {!loading ? "Register" : "please wait..."}
            </button>
          </form>
          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-center text-xs text-green-600">
              {success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegister;
