"use client";
import { useEffect } from "react";
import axios from "axios";
import Header from "@/public/src/components/RegistrationPageComponents/header";
import style from "./Registration.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Input from "@/public/src/components/RegistrationPageComponents/forminput";
import Trackchoice from "@/public/src/components/RegistrationPageComponents/Trackchoice";

const Registration = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY;
  const Navigation = useRouter();
  const searchParams = useSearchParams();
  const eventid = searchParams.get("Programid");

  const uploadImage = async (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "studentsimages");
    formdata.append("cloud_name", "dnowbob2t");
    try {
      const response = await axios.post(`${CLOUDINARY_URL}`, formdata);
      return {
        url: response.data.secure_url,
        public_id: response.data.public_id,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Cloudinary URL:", CLOUDINARY_URL);
      return null;
    }
  };

  // In other to store URL parameter to send each program to its own end point.
  // const [Query, SetQuery] = useState(null);

  // useEffect(() => {
  //   if (Programid) {
  //     SetQuery(Programid);
  //   }
  // }, [Programid]);

  const [student_name, setstudent_name] = useState("");
  const [student_matricnumber, setstudent_matricnumber] = useState("");
  const [student_email, setstudent_email] = useState("");
  const [student_department, setstudent_department] = useState("");
  const [student_gender, setstudent_gender] = useState("");
  const [student_photo, setstudent_photo] = useState(null);
  const [trackid, settrackid] = useState("");
  const [Error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setloading] = useState(false);
  const [navigating, setnavigating] = useState(false);

  const handlegoback = () => {
    setnavigating(true);
    Navigation.push("./");
  };

  //To send  all the students information to thier specific event they register for
  const Handlesubmit = async () => {
    setloading(true);
    if (
      !student_name ||
      !student_matricnumber ||
      !student_email ||
      !student_department ||
      !student_gender ||
      !trackid
    ) {
      seterror("Please fill in all required fields.");
      setsuccess("");
      setTimeout(() => {
        seterror("");
      }, 4000);
      setloading(false);
      return;
    }

    // Use local variables to store uploaded image data
    let imageUrl = "";
    let imagePublicId = "";

    if (student_photo) {
      const uploadResult = await uploadImage(student_photo);
      if (uploadResult) {
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.public_id;
      } else {
        seterror("Image upload failed. Please try again.");
        setsuccess("");
        setloading(false);
        setTimeout(() => {
          seterror("");
        }, 4000);
        return;
      }
    }

    try {
      const Response = await axios.post(`${API}/Registerstudent`, {
        student_name,
        student_matricnumber,
        student_email,
        student_department,
        student_gender,
        eventid,
        trackid,
        student_imageurl: imageUrl,
        student_image_puplic_id: imagePublicId,
      });
      if (Response.data.message) {
        setsuccess(Response.data.message);
        seterror("");
        setTimeout(() => {
          setsuccess("");
        }, 4000);
        setloading(false);
      } else if (Response.data.Error) {
        seterror(Response.data.Error);
        setsuccess("");
      }
    } catch (Error) {
      seterror(
        Error.response?.data?.Error || Error.message || "Registration failed"
      );
      setsuccess("");
      setloading(false);
      setTimeout(() => {
        seterror("");
      }, 4000);
    }
    setloading(false);
    setstudent_name("");
    setstudent_matricnumber("");
    setstudent_email("");
    setstudent_department("");
    setstudent_gender("");
    settrackid("");
    setstudent_photo(null);
  };

  return (
    <div>
      {navigating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            color: "white",
            fontSize: "20px",
          }}
        >
          Loading...
        </div>
      )}
      <div className={style.Header}>
        <Header />
      </div>
      {/* <button
        className="text-white font-mono bg-[#7741C3] text-xs ml-13 md:ml-53 mr-40 w-30 py-0.5 px-1 text-center my-2 lg:ml-68"
        onClick={handlegoback}
        disabled={navigating}
      >
        {navigating ? "Loading..." : "Back to Events"}
      </button> */}
      <div className="mx-1 mb-20 bg-white rounded-lg border border-[rgba(159,118,216,0.8)] w-80 lg:w-203 md:w-125 justify-self-center p-6 mt-10">
        <h3 className={style.title}>Event Registration</h3>
        <h3 className={style.subtitle}>
          Please fill in your details to register for this event{" "}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Handlesubmit();
          }}
        >
          <Input
            type="text"
            label="Fullname"
            value={student_name}
            setValue={setstudent_name}
          />
          <Input
            type="text"
            label="Matric number"
            value={student_matricnumber}
            setValue={setstudent_matricnumber}
          />
          <Input
            type="email"
            label="Email"
            value={student_email}
            setValue={setstudent_email}
          />
          <Input
            type="text"
            label="Department"
            value={student_department}
            setValue={setstudent_department}
          />
          <label className={style.title}>Gender</label>
          <div className={style.subtitle}>
            <select
              style={{ border: "none", outline: "none" }}
              value={student_gender}
              onChange={(event) => setstudent_gender(event.target.value)}
            >
              <option value="">Select Gender</option>
              <option className={style.title} value="male">
                Male
              </option>
              <option className={style.title} value="female">
                Female
              </option>
            </select>
          </div>

          <Trackchoice
            label="Select your Track"
            value={trackid}
            setValue={settrackid}
          />
          <label className={style.title}>Upload your Passport Photograph</label>
          <div className={style.subtitle}>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(event) => setstudent_photo(event.target.files[0])}
            />
          </div>
          <button className={style.submitbutton} type="submit">
            {!loading ? "Register" : "please wait..."}
          </button>
          {Error && <p className={style.error}>{Error}</p>}
          {success && <p className={style.success}>{success}</p>}
        </form>
      </div>
    </div>
  );
};
export default Registration;
