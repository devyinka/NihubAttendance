"use client";
import { useRouter } from "next/navigation";
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

  // let [Role,setRole]=useState("Admin");// use let to change the role
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
    Navigation.push("/ForgotPassword");
  };

  const handleRegister = () => {
    Navigation.push("/SuperAdminRegister");
  };

  return (
    <div>
      <Header info={"Admin login"} />
      <div>
        <button className={style.backbotton} onClick={handlegoback}>
          Back to Events{" "}
        </button>
      </div>
      <div className={style.container}>
        <h2 className={style.Login}>Login</h2>
        <h6 className={style.subtitle}>
          Sign in to access the admin dashboard
        </h6>
        <div className={style.Role}>
          <button
            className={Role == "Admin" ? style.Active : ""}
            onClick={() => handleRoleChange("Admin")}
          >
            {" "}
            Admin{" "}
          </button>
          <button
            className={Role == "SubAdmin" ? style.Active : ""}
            onClick={() => handleRoleChange("SubAdmin")}
          >
            SubAdmin
          </button>
        </div>
        {Role == "Admin" ? (
          <div>
            (
            <form
              className={style.form}
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
              <button
                type="button"
                className={style.forgot}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
              <button type="submit" className={style.submit}>
                {" "}
                {!loading ? "login As Admin" : "please wait..."}
              </button>
            </form>
            )
            <button className={style.Register} onClick={handleRegister}>
              {" "}
              Register superadmin{" "}
            </button>
          </div>
        ) : (
          <form
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
            <button
              type="button"
              className={style.forgot}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
            <button type="submit" className={style.submit}>
              {" "}
              {!loading ? "login As Sub-Admin" : "please wait..."}{" "}
            </button>
          </form>
        )}
        {Error && (
          <p style={{ color: "red", justifySelf: "center" }}>{Error}</p>
        )}
        {Success && (
          <p style={{ color: "green", justifySelf: "center" }}>{Success}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
