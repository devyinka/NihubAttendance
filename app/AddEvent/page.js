"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminDashboardLayout from "@/public/src/GeneralNavComponent";
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
      <AdminDashboardLayout
        role={Role}
        activeButton={button}
        setActiveButton={setbutton}
      />
      <Scroll>
        <div className="mt-2 pt-0.8% mx-4 lg:mx-8 md:mx-6 mb-0.5% rounded-lg border border-gray-200 bg-white">
          <h3 className="text-[#7741c3] font-bold text-xl  pl-5 mb-1 font-mono">
            Create New Event
          </h3>
          <h1 className="text-gray-500 text-sm mb-4 font-mono pl-5">
            Add a new event to the platform
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlsaveevent();
            }}
            className="space-y-4"
          >
            <div className="ml-2 flex flex-wrap -mx-2 w-[80%] lg:w-[96.5%]">
              <div className="w-full md:w-1/2 px-2">
                <Input
                  type="text"
                  label="Event tilte"
                  value={eventname}
                  setValue={seteventname}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <Input
                  type="date"
                  label="Event date"
                  value={eventdate}
                  setValue={seteventdate}
                />
              </div>
            </div>
            <div className="lg:w-[96.5%] ml-2 px-2 w-[79%]">
              <DescribeInput
                type="text"
                label="Description"
                value={eventdescription}
                setValue={seteventdescription}
              />
            </div>
            <div className="ml-2 flex flex-wrap -mx-2 w-[80%] lg:w-[96.5%]">
              <div className="w-full md:w-1/2 px-2">
                <Input
                  type="text"
                  label="Event location"
                  value={eventlocation}
                  setValue={seteventlocation}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <Input
                  type="number"
                  label="Event capacity"
                  value={eventcapacity}
                  setValue={seteventcapacity}
                />
              </div>
            </div>
            <div className="ml-2">
              <label className="ml-2 text-[#7741c3] font-medium font-family-mono text-sm  mb-1">
                Choose event image
              </label>
              <div className="border ml-2 border-gray-300 rounded-md  w-[76%] lg:w-[95.5%] bg-[#f3f3f5] py-2 text-[#717182] font-mono pl-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setphoto(event.target.files[0])}
                />
              </div>
            </div>
            <div className="flex justify-between mx-4">
              <button
                type="button"
                className="bg-[#7741c3] text-white px-4 py-2 rounded-md hover:bg-[#5e2a9e] transition-colors duration-300"
                onClick={handledropdown}
              >
                create track
              </button>
              <button
                className="bg-[#7741c3] text-white px-4 py-2 rounded-md hover:bg-[#5e2a9e] transition-colors duration-300"
                type="submit"
              >
                {!loading ? "Create Event" : "please wait.."}
              </button>
            </div>
          </form>
          {dropdown ? (
            <div className="mt-4 border-t border-gray-300 pt-4">
              <div className=" ml-4 flex justify-between w-[77%]">
                <Input
                  type="text"
                  label="Trackname"
                  value={trackname}
                  setValue={settrackname}
                />
              </div>
              <button
                type="button"
                className="bg-[#7741c3] text-white px-4 py-2 ml-4 my-4 rounded-md hover:bg-[#5e2a9e] transition-colors duration-300"
                onClick={handleaddtrack}
              >
                Add track
              </button>
            </div>
          ) : null}
        </div>
        {error && (
          <p className="text-red-500 justify-center text-center mt-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-center mt-2">{success}</p>
        )}
      </Scroll>
    </div>
  );
};

export default AddEvent;
