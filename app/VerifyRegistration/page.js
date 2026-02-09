"use client";
import Link from "next/link";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import style from "@/app/AdminLogin/page.module.css";
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
    <div>
      <Header info={"Register Admin"} />
      {/* <div>
        <button className={style.backbotton} onClick={handlegoback}>
          Back to Login
        </button>
      </div> */}
      <div className=" flex items-center justify-center fixed inset-0">
        <div className="border border-[#7741c3]  w-80 md:w-120 h-130 flex items-center justify-center flex-col rounded-lg p-4 bg-white shadow-lg">
          <h2 className="mt-3 text-[#7741c3]">Register New Admin</h2>
          <form>
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
              label="Verification-Code"
              value={verificationCode}
              setValue={setverificationCode}
            />
            <Input
              type="password"
              label="password"
              value={password}
              setValue={setPassword}
            />
            <Input
              type="password"
              label="confirm-password"
              value={re_enterpassword}
              setValue={set_re_enterpassword}
            />
            <h2 className={style.subtitle}>
              Ensure the password is up to 6 or 8 characters
            </h2>
            <button
              type="submit"
              className={style.submit}
              onClick={handlesubmit}
            >
              {" "}
              {!loading ? "Register new Admin" : "please wait..."}
            </button>
            {error && (
              <p style={{ color: "red", justifySelf: "center" }}>{error}</p>
            )}
            {Success && (
              <p style={{ color: "green", justifySelf: "center" }}>{Success}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterpage;
