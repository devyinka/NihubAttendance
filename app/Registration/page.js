"use client";
import { useEffect } from "react";
import axios from "axios";
import Header from "@/public/src/components/RegistrationPageComponents/header";
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
        Error.response?.data?.Error || Error.message || "Registration failed",
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(119,65,195,0.14),_rgba(255,255,255,0.9)_55%)]">
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
      <div>
        <Header />
      </div>
      <div className="mx-auto mb-20 mt-10 w-full max-w-2xl rounded-2xl border border-[#7741c3]/30 bg-white/95 p-6 shadow-[0_20px_60px_rgba(55,24,90,0.15)] backdrop-blur sm:p-8">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-bold text-[#7741c3]">
            Event Registration
          </h3>
          <p className="text-xs text-gray-500">
            Please fill in your details to register for this event.
          </p>
        </div>
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
          <label className="mt-2 mb-1 block pl-[4%] text-[#7741C3] text-[90%]">
            Sex
          </label>
          <div className="mx-[4%] mb-2 rounded-[4px] border border-transparent bg-[#F3F3F5] px-[2%] py-2 text-[70%] text-[#717182]">
            <select
              className="w-full bg-transparent outline-none"
              value={student_gender}
              onChange={(event) => setstudent_gender(event.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <Trackchoice
            label="Select your Track"
            value={trackid}
            setValue={settrackid}
          />
          <label className="mt-2 mb-1 block pl-[4%] text-[#7741C3] text-[90%]">
            Photo
          </label>
          <div className="mx-[4%] mb-2 rounded-[4px] border border-transparent bg-[#F3F3F5] px-[2%] py-2 text-[70%] text-[#717182]">
            <input
              required
              type="file"
              accept="image/*"
              onChange={(event) => setstudent_photo(event.target.files[0])}
              className="w-full text-xs text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#7741C3]"
            />
          </div>
          <button
            className="mt-3 w-full rounded-md bg-[#7741c3] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#6a39b0]"
            type="submit"
          >
            {!loading ? "Register" : "please wait..."}
          </button>
          {Error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-600">
              {Error}
            </p>
          )}
          {success && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-center text-xs text-green-600">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
export default Registration;
