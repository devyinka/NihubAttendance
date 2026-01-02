"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import style from "./Trackchoice.module.css";

const Trackchoice = ({ label, value, setValue }) => {
  const ApI = process.env.NEXT_PUBLIC_API;
  const [options, setoptions] = useState([]); // uncomment all this line after intgrate with backend
  const searchParams = useSearchParams();
  const eventid = searchParams.get("Programid");

  useEffect(() => {
    if (!eventid) return;

    const Gettrackofevent = async () => {
      try {
        const Response = await axios.post(`${ApI}/GetEventTracks`, { eventid });
        const tracks = Response.data?.tracks ?? Response.data;
        setoptions(tracks);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    Gettrackofevent();
  }, [eventid]);

  return (
    <div>
      <label className={style.title}>{label}</label>
      <div className={style.inputsubtitle}>
        <select
          style={{ border: "none", outline: "none" }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option className={style.title} key={option._id} value={option._id}>
              {option.trackName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Trackchoice;
