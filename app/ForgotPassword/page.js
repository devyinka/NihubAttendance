"use client";
import { useRouter } from "next/navigation";
import style from "@/app/AdminLogin/page.module.css";
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
    Navigation.push("/AdminLogin"); //  i will later remove this
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
    <div>
      <Header info={"Super Admin Register"} />
      <div>
        <button className={style.backbotton} onClick={handlebacktologin}>
          Back to login
        </button>
      </div>
      <div className={style.container}>
        <form
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
          <button type="submit" className={style.submit}>
            {!loading ? "Reset Password" : "please wait..."}
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
  );
};

export default ForgotPassword;
