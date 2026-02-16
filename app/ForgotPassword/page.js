"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import axios from "axios";
import { useState } from "react";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import { useContext } from "react";
import Input from "@/public/src/components/AdminLoginpageComponents/Forminput";

const ForgotPassword = () => {
  const { Role } = useContext(Rolecontex);
  const API = process.env.NEXT_PUBLIC_API;
  const Navigation = useRouter();
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setloading] = useState(false);
  const [Email, setEmail] = useState("");

  const handlebacktologin = () => {
    // Navigation handled by Link component
  };

  const handlesubmit = async () => {
    const Emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setloading(true);
    if (!Email) {
      seterror("Email is required");
      setsuccess("");
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }
    if (!Emailregex.test(Email)) {
      seterror("Invalid Email");
      setsuccess("");
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    try {
      let response;
      if (Role === "Admin") {
        response = await axios.post(`${API}/AdminForgotPassword`, { Email });
      } else if (Role === "SubAdmin") {
        response = await axios.post(`${API}/SubAdminForgotPassword`, { Email });
      }

      if (response?.data?.Error) {
        seterror(response.data.Error);
        setsuccess("");
        setTimeout(() => {
          seterror("");
        }, 4000);
      } else {
        setsuccess(response?.data?.message || "Request successful");
        setTimeout(() => {
          setsuccess("");
        }, 4000);
      }
    } catch (err) {
      const message = err?.response?.data?.Error || "Something went wrong";
      seterror(message);
      setsuccess("");
      setTimeout(() => {
        seterror("");
      }, 4000);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(119,65,195,0.14),_rgba(255,255,255,0.9)_55%)]">
      <Header info={"Forgot Password"} />
      <div className="mx-auto flex min-h-[calc(100vh-50px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#7741c3]/30 bg-white/95 p-6 shadow-[0_20px_60px_rgba(55,24,90,0.15)] backdrop-blur">
          <div className="mb-5 text-center">
            <h2 className="text-lg font-bold text-[#7741c3]">
              Reset your password
            </h2>
            <p className="text-xs text-gray-500">
              Enter your registered email to receive reset instructions.
            </p>
          </div>
          <form
            className="space-y-1"
            onSubmit={(e) => {
              e.preventDefault();
              handlesubmit();
            }}
          >
            <Input
              type="email"
              label="Registered Email"
              value={Email}
              setValue={setEmail}
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-md bg-[#7741c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a39b0]"
            >
              {!loading ? "Reset Password" : "please wait..."}
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
          <div className="mt-4 text-center">
            <Link
              href="/AdminLogin"
              prefetch={true}
              className="text-xs font-mono text-[#7741c3] underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
