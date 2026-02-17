"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import Input from "@/public/src/components/AdminLoginpageComponents/Forminput";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import Cookies from "js-cookie";

const Login = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const { Role, setRole } = useContext(Rolecontex);
  const Navigation = useRouter();
  const [Email, setEmail] = useState("nihubeventapp@gmail.com");
  const [subAdminEmail, setsubAdminEmail] = useState("Sub-Admin@gmail.com");
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("SubAdmin");
  const [Error, setError] = useState("");
  const [Success, SetSuccess] = useState("");
  const [loading, setloading] = useState(false);

  // to change Admin to Sub-Admin
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setloading(false);
    setError("");
  };

  const handlesubmit = async () => {
    setloading(true);

    if (!Email || (!Password && Role == "Admin")) {
      setError("Fill all the neccessary details");
      setTimeout(() => setError(null), 4000);
      SetSuccess("");
      setloading(false);
      return;
    }

    if (!subAdminEmail || !Password || (!Username && Role == "SubAdmin")) {
      setError("you are required to fill all your details");
      setTimeout(() => setError(null), 4000);
      SetSuccess("");
      setloading(false);
      return;
    }

    if (Role == "Admin") {
      try {
        Response = await axios.post(`${API}/AdminSignin`, {
          Email,
          Password,
          Role,
        });
        SetSuccess(Response.data?.message);
        setTimeout(() => SetSuccess(null), 4000);
        setError(Response.data?.Error);
        setloading(false);

        if (Response.data.token) {
          SetSuccess(Response.data?.message);
          Cookies.set("token", Response.data.token);
          Navigation.push("/AddEvent");
        }

        // return Response.data
      } catch (error) {
        setError(error.message);
        SetSuccess("");
        setloading(false);
      }
    } else {
      try {
        const Response = await axios.post(`${API}/SubAdminSignin`, {
          Username,
          subAdminEmail,
          Password,
          Role,
        });
        SetSuccess(Response.data?.message);
        setError(Response.data?.Error);
        setTimeout(() => SetSuccess(null), 4000);
        setloading(false);

        if (Response.data.token) {
          SetSuccess(Response.data.message);
          Cookies.set("token", Response.data.token);
          Navigation.push("/AddEvent");
        }

        // return Response.data
      } catch (error) {
        setError(error.message);
        SetSuccess("");
        setloading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(119,65,195,0.14),_rgba(255,255,255,0.9)_55%)]">
      <Header info={"Admin login"} />
      <div className="mx-auto flex min-h-[calc(100vh-50px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#7741c3]/30 bg-white/95 p-6 shadow-[0_20px_60px_rgba(55,24,90,0.15)] backdrop-blur">
          <div className="mb-5 text-center">
            <h2 className="text-lg font-bold text-[#7741c3]">
              Welcome to Nihub
            </h2>
            <p className="text-xs text-gray-500">
              Sign in to access the admin dashboard
            </p>
          </div>

          <div className="mb-5 flex items-center rounded-full bg-[#f3f3f5] p-1 text-[70%] font-mono text-gray-500">
            <button
              className={`flex-1 rounded-full px-3 py-1 transition ${
                Role == "Admin"
                  ? "bg-white text-[#7741c3] shadow"
                  : "hover:text-[#7741c3]"
              }`}
              onClick={() => handleRoleChange("Admin")}
            >
              Admin
            </button>
            <button
              className={`flex-1 rounded-full px-3 py-1 transition ${
                Role == "SubAdmin"
                  ? "bg-white text-[#7741c3] shadow"
                  : "hover:text-[#7741c3]"
              }`}
              onClick={() => handleRoleChange("SubAdmin")}
            >
              SubAdmin
            </button>
          </div>

          {Role == "Admin" ? (
            <div>
              <form
                className="space-y-1"
                onSubmit={(e) => {
                  e.preventDefault(), handlesubmit();
                }}
              >
                <Input
                  type="Email"
                  label="Email"
                  value={Email}
                  setValue={setEmail}
                />
                <Input
                  type="password"
                  label="Password"
                  value={Password}
                  setValue={setPassword}
                />
                <div className="flex justify-end pr-1">
                  <Link
                    href="/ForgotPassword"
                    prefetch={true}
                    className="text-xs font-mono text-[#7741c3] underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full rounded-md bg-[#7741c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a39b0]"
                >
                  {!loading ? "Login as Admin" : "please wait..."}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link
                  href="/SuperAdminRegister"
                  prefetch={true}
                  className="text-xs font-mono text-[#7741c3] underline"
                >
                  Register superadmin
                </Link>
              </div>
            </div>
          ) : (
            <form
              className="space-y-1"
              onSubmit={(e) => {
                e.preventDefault(), handlesubmit();
              }}
            >
              <Input
                type="text"
                label="Username"
                value={Username}
                setValue={setUsername}
              />
              <Input
                type="Email"
                label="Email"
                value={subAdminEmail}
                setValue={setsubAdminEmail}
              />
              <Input
                type="password"
                label="Password"
                value={Password}
                setValue={setPassword}
              />
              <div className="flex justify-end pr-1">
                <Link
                  href="/ForgotPassword"
                  prefetch={true}
                  className="text-xs font-mono text-[#7741c3] underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="mt-3 w-full rounded-md bg-[#7741c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a39b0]"
              >
                {!loading ? "Login as Sub-Admin" : "please wait..."}
              </button>
            </form>
          )}
          {Error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-600">
              {Error}
            </p>
          )}
          {Success && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-center text-xs text-green-600">
              {Success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
