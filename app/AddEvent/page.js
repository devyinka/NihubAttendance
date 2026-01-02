"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./Addevent.module.css";
import { useState } from "react";
import Input from "@/public/src/components/AddEventPageComponents/Forminput";
import Header from "@/public/src/components/AddEventPageComponents/header";
import DescribeInput from "@/public/src/components/AddEventPageComponents/Descriptioninput";
import Scroll from "@/public/src/components/scroll";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import { useContext } from "react";

const AddEvent = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY;

  const Navigation = useRouter();
  const { Role } = useContext(Rolecontex);
  let [button, setbutton] = useState("create"); // to know which button is active
  const [eventname, seteventname] = useState("");
  const [eventdate, seteventdate] = useState("");
  const [eventlocation, seteventlocation] = useState("");
  const [eventdescription, seteventdescription] = useState("");
  const [eventcapacity, seteventcapacity] = useState("");
  const [photo, setphoto] = useState("");
  const [eventstatus, seteventstatus] = useState(true);
  const [trackname, settrackname] = useState("");
  const [trackabbrivation, settrackabbrvation] = useState("");
  const [eventtracks, seteventtracks] = useState([]);
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setloading] = useState(false);
  const [dropdown, setdropdown] = useState(false);

  let id = 0;

  const handleAttendancepage = (change) => {
    Navigation.push("./Attendance");
    setbutton(change);
  };

  const handlecreatepage = (change) => {
    Navigation.push("./AddEvent");
    setbutton(change);
  };

  const handlemanagepage = (change) => {
    Navigation.push("./ManageEvent");
    setbutton(change);
  };

  const handlesubadmnpage = (change) => {
    Navigation.push("./subadmin");
    setbutton(change);
  };

  const handlelogout = () => {
    Navigation.push("./");
  };

  //handle form dropdown to add tracks of the evet
  const handledropdown = () => {
    setdropdown(!dropdown);
  };

  // to upload image to cloudinary
  const uploadImage = async (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "event_images");
    formdata.append("cloud_name", "dnowbob2t");
    try {
      const response = await axios.post(`${CLOUDINARY_URL}`, formdata);
      return {
        url: response.data.secure_url,
        public_id: response.data.public_id,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // use to store the track in an event collection and make trackvariable empty after that
  const handleaddtrack = () => {
    if (!trackname) {
      seterror("Please fill in all required fields.");
      setTimeout(() => seterror(null), 4000);
      setdropdown(true);
      return;
    } else {
      const newtrack = {
        // trackAbbreviation: trackabbrivation,
        trackName: trackname,
      };

      //save all the available tracks for each event
      seteventtracks([...eventtracks, newtrack]);
    }
    settrackname("");
    settrackabbrvation("");
  };

  // to submit the new event to the backend
  const handlsaveevent = async () => {
    setloading(true);
    if (!eventname || !eventdate || !eventlocation || !eventdescription) {
      seterror("Please fill in all required fields.");
      setTimeout(() => seterror(null), 4000);
      setsuccess("");
      setloading(false);
      setdropdown(false);
      return;
    }
    // upload image to cloudinary
    let eventimageurl = "";
    let eventimagepublicid = "";
    if (photo) {
      const imageData = await uploadImage(photo);
      eventimageurl = imageData.url;
      eventimagepublicid = imageData.public_id;
    }
    // create new event object

    try {
      const Response = await axios.post(`${API}/CreateEvent`, {
        eventname,
        eventdate,
        eventdescription,
        eventlocation,
        eventcapacity,
        eventimageurl,
        eventimagepublicid,
        eventstatus,
        eventtracks: eventtracks?.length ? eventtracks : null,
      });
      setloading(false);
      if (Response.data?.message) {
        setsuccess(Response.data?.message);
        setTimeout(() => setsuccess(""), 4000);
        seterror("");
      } else {
        if (Response.data?.Error) {
          seterror(Response.data?.Error);
          setTimeout(() => seterror(""), 4000);
          setsuccess("");
        }
      }
    } catch (error) {
      seterror(error.message);
      setsuccess("");
      console.error("Error creating event:", error);
      setloading(false);
    } finally {
      setloading(false);
      seteventname("");
      seteventdate("");
      seteventdescription("");
      seteventcapacity("");
      seteventlocation("");
      seteventcapacity("");
      setphoto("");
      seteventstatus(true);
      seteventtracks([]);
      settrackname("");
      settrackabbrvation("");
      setdropdown(false);
    }
  };

  return (
    <div>
      <Header info="Create Event" />
      <div className={style.container}>
        <div className={style.Titleandlogoutcontainer}>
          <div className={style.title}>Admin Dashboard</div>
          <div>
            <button onClick={handlelogout} className={style.logoutbox}>
              <Image
                src="/logout.svg"
                width={14}
                height={14}
                alt="logouticon"
              />
              <div className={style.logout}> logout</div>
            </button>
          </div>
        </div>
        <h4 className={style.subtitle}>
          Manage events, attendance, and sub-admin requests.{" "}
        </h4>
      </div>
      {Role == "Admin" ? (
        <div className={style.buttonscontainer}>
          <button
            className={button == "create" ? style.Active : ""}
            onClick={() => handlecreatepage("create")}
          >
            {" "}
            Create events
          </button>
          <button
            className={button == "manage" ? style.Active : ""}
            onClick={() => handlemanagepage("manage")}
          >
            Manage events
          </button>
          <button
            className={button == "Attendance" ? style.Active : ""}
            onClick={() => handleAttendancepage("Attendance")}
          >
            Attendance
          </button>
          <button
            className={button == "subadmin" ? style.Active : ""}
            onClick={() => handlesubadmnpage("subadmin")}
          >
            Sub-Admins
          </button>
        </div>
      ) : (
        <div className={style.buttonscontainer}>
          <button
            className={button == "create" ? style.Active : ""}
            onClick={() => handlecreatepage("create")}
          >
            {" "}
            Create events
          </button>
          <button
            className={button == "manage" ? style.Active : ""}
            onClick={() => handlemanagepage("manage")}
          >
            Manage events
          </button>
          <button
            className={button == "Attendance" ? style.Active : ""}
            onClick={() => handleAttendancepage("Attendance")}
          >
            Attendance
          </button>
        </div>
      )}
      <Scroll>
        <div className={style.formcontainer}>
          <h3 className={style.create}>Create New Event</h3>
          <h1 className={style.createsubtitle}>
            Add a new event to the platform
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlsaveevent();
            }}
            className={style.form}
          >
            <div className={style.inputcontainer}>
              <Input
                type="text"
                label="Event tilte"
                value={eventname}
                setValue={seteventname}
              />
              <Input
                type="date"
                label="Event date"
                value={eventdate}
                setValue={seteventdate}
              />
            </div>
            <DescribeInput
              type="text"
              label="Description"
              value={eventdescription}
              setValue={seteventdescription}
            />
            <div className={style.inputcontainer}>
              <Input
                type="text"
                label="Event location"
                value={eventlocation}
                setValue={seteventlocation}
              />
              <Input
                type="number"
                label="Event capacity"
                value={eventcapacity}
                setValue={seteventcapacity}
              />
            </div>
            <div className={style.inputcontainer2}>
              <label className={style.eventimagetitle}>chose event image</label>
              <div className={style.eventimagesubtitle}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setphoto(event.target.files[0])}
                />
              </div>
            </div>
            <div className={style.inputcontainer3}>
              <button
                type="button"
                className={style.button}
                onClick={handledropdown}
              >
                create track
              </button>
              <button className={style.button} type="submit">
                {!loading ? "Create Event" : "please wait.."}
              </button>
            </div>
          </form>

          {dropdown ? (
            <div className={style.trackform}>
              <div className={style.dropdowncontainer}>
                <Input
                  type="text"
                  label="Trackname"
                  value={trackname}
                  setValue={settrackname}
                />
                {/* <Input
                  type="text"
                  label="Track Abbrevation"
                  value={trackabbrivation}
                  setValue={settrackabbrvation}
                /> */}
              </div>
              <button
                type="button"
                className={style.button2}
                onClick={handleaddtrack}
              >
                Add track
              </button>
            </div>
          ) : null}
        </div>
        {error && <p className={style.error}>{error}</p>}
        {success && <p className={style.success}>{success}</p>}
      </Scroll>
    </div>
  );
};

export default AddEvent;
