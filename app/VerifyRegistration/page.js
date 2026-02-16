"use client";
import Link from "next/link";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import Input from "@/public/src/components/AdminLoginpageComponents/Forminput";
import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const AdminRegisterpage = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const searchParams = useSearchParams();
  const Useremail = searchParams.get("Email");
  const Username = searchParams.get("Username");
  const option = searchParams.get("option");
  const Role = searchParams.get("Role");
  const Userverificationcode = searchParams.get("verificationCode");
  const Navigation = useRouter();
  const [username, setusername] = useState(Username || "");
  const [password, setPassword] = useState("");
  const [re_enterpassword, set_re_enterpassword] = useState("");
  const [email, setemail] = useState(Useremail || "");
  const [verificationCode, setverificationCode] = useState(
    Userverificationcode || "",
  );
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [Success, setSucess] = useState("");

  const handlegoback = () => {
    // Navigation handled by Link component
  };

  const handlesubmit = async (event) => {
    event.preventDefault();
    setloading(true);
    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!username || !email || !password || !re_enterpassword) {
      seterror("you are required to fill all the fields");
      setloading(false);
      setTimeout(() => seterror(null), 4000);
      return;
    } else if (password !== re_enterpassword) {
      seterror("your password is not match");
      setloading(false);
      setTimeout(() => seterror(null), 4000);
      return;
    } else if (password.length < 6) {
      seterror("your password must be up to 6 or 8 in characters");
      setloading(false);
      setTimeout(() => seterror(null), 4000);
      return;
    } else if (!emailregex.test(email)) {
      seterror("invalid Email");
      setloading(false);
      setTimeout(() => seterror(null), 4000);
      return;
    }
    try {
      let response;
      if (option === "Admin Registration" && Role === "Admin") {
        response = await axios.post(`${API}/VerifyAdminRegistration`, {
          username,
          email,
          password,
          verificationCode,
        });
      } else if (option === "Forgot Password" && Role === "Admin") {
        response = await axios.post(`${API}/AdminResetPassword`, {
          email,
          password,
          resetCode: verificationCode,
        });
      } else if (option === "Forgot Password" && Role === "SubAdmin") {
        response = await axios.post(`${API}/SubAdminResetPassword`, {
          email,
          password,
          resetCode: verificationCode,
        });
      }

      if (response?.data?.Error) {
        seterror(response.data.Error);
        setSucess("");
      } else {
        setSucess(response?.data?.message);
        seterror("");
      }
      setTimeout(() => seterror(""), 4000);
    } catch (err) {
      setSucess("");
      seterror(err?.response?.data?.Error);
      setTimeout(() => seterror(""), 4000);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(119,65,195,0.14),_rgba(255,255,255,0.9)_55%)]">
      <Header info={"Verify Registration"} />
      <div className="mx-auto flex min-h-[calc(100vh-50px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#7741c3]/30 bg-white/95 p-6 shadow-[0_20px_60px_rgba(55,24,90,0.15)] backdrop-blur">
          <div className="mb-5 text-center">
            <h2 className="text-lg font-bold text-[#7741c3]">
              Complete your registration
            </h2>
            <p className="text-xs text-gray-500">
              Enter your details and verification code to proceed.
            </p>
          </div>
          <form className="space-y-1" onSubmit={handlesubmit}>
            <Input
              type="text"
              label="User name"
              value={username}
              setValue={setusername}
            />
            <Input
              type="email"
              label="Email"
              value={email}
              setValue={setemail}
            />
            <Input
              type="text"
              label="Verification code"
              value={verificationCode}
              setValue={setverificationCode}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              setValue={setPassword}
            />
            <Input
              type="password"
              label="Confirm password"
              value={re_enterpassword}
              setValue={set_re_enterpassword}
            />
            <p className="mt-1 text-center text-[10px] text-gray-500">
              Password should be at least 6 characters.
            </p>
            <button
              type="submit"
              className="mt-3 w-full rounded-md bg-[#7741c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a39b0]"
            >
              {!loading ? "Continue" : "please wait..."}
            </button>
            {error && (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                {error}
              </p>
            )}
            {Success && (
              <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-center text-xs text-green-600">
                {Success}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterpage;
