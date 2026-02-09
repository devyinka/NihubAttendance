"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import style from "./page.module.css";
import Input from "@/public/src/components/AdminLoginpageComponents/Forminput";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import Cookies from "js-cookie";

const Login = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const { Role, setRole } = useContext(Rolecontex);
  const Navigation = useRouter();

  const handlegoback = () => {
    Cookies.remove("token", { path: "/" });
    Navigation.push("./");
  };
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

  const handleForgotPassword = () => {
    // Navigation handled by Link component
  };

  const handleRegister = () => {
    // Navigation handled by Link component
  };

  return (
    <div>
      <Header info={"Admin login"} />
      {/* <div>
        <button className={style.backbotton} onClick={handlegoback}>
          Back to Events{" "}
        </button>
      </div> */}
      <div className=" flex items-center justify-center fixed inset-0 ">
        <div className="border border-[#7741c3] w-80 h-90 flex items-center justify-center flex-col rounded-lg p-4 bg-white shadow-lg">
          <h2 className="text-[#7741c3] font-mono text-xs place-self-center pt-0 mb-1 font-bold">
            Login
          </h2>
          <h6 className="text-gray-500 text-xs mb-1">
            Sign in to access the admin dashboard
          </h6>

          <div className="flex justify-around text-gray-500 font-mono text-[70%] w-[90%] bg-[#f3f3f5] rounded-md p-1 mb-2">
            <button
              className={
                Role == "Admin"
                  ? "bg-white rounded-[20px] w-[50%] text-[#7741c3] mt-0"
                  : ""
              }
              onClick={() => handleRoleChange("Admin")}
            >
              Admin
            </button>
            <button
              className={
                Role == "SubAdmin"
                  ? "bg-white rounded-[20px] w-[50%] text-[#7741c3] mt-0"
                  : ""
              }
              onClick={() => handleRoleChange("SubAdmin")}
            >
              SubAdmin
            </button>
          </div>
          {Role == "Admin" ? (
            <div>
              <form
                className="w-75"
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
                <Link
                  href="/ForgotPassword"
                  prefetch={true}
                  className="bg-none text-[#7741c3] font-mono text-xs mt-2  ml-5 underline cursor-pointer flex place-self-end pr-3"
                >
                  Forgot Password?
                </Link>
                <button
                  type="submit"
                  className=" text-white bg-[#7741c3] font-mono text-xs font-normal mt-2 mb-1 rounded-md w-[90%] p-2 ml-5"
                >
                  {!loading ? "login As Admin" : "please wait..."}
                </button>
              </form>
              <Link
                href="/SuperAdminRegister"
                prefetch={true}
                className={style.Register}
              >
                Register superadmin{" "}
              </Link>
            </div>
          ) : (
            <form
              className="w-75"
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
              <Link
                href="/ForgotPassword"
                prefetch={true}
                className="bg-none text-[#7741c3] font-mono text-xs mt-2  ml-5 underline cursor-pointer flex place-self-end pr-3"
              >
                Forgot Password?
              </Link>
              <button
                type="submit"
                className=" text-white bg-[#7741c3] font-mono text-xs font-normal mt-2 mb-1 rounded-md w-[90%] p-2 ml-5 "
              >
                {" "}
                {!loading ? "login As Sub-Admin" : "please wait..."}{" "}
              </button>
            </form>
          )}
          {Error && (
            <p className="text-red-600 text-xs text-center place-self-center">
              {Error}
            </p>
          )}
          {Success && (
            <p className="text-green-600 text-xs text-center place-self-center">
              {Success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
