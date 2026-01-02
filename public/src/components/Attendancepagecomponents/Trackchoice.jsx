import data from "../AddEventPageComponents/backendresponsemock";
import style from "./trackchoice.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { Attendancecontex } from "./Attendancecontex";

const Trackchoice = ({ label, value, setValue }) => {
  const API = process.env.NEXT_PUBLIC_API;
  const {
    selectedeventid,
    setselectedeventid,
    selectedtrackid,
    setselectedtrackid,
    seterror,
    setstudentinfo,
  } = useContext(Attendancecontex);

  const [Events, setEvents] = useState([]); // it will be use to replace the mock data
  const [trackvalue, settrackvalue] = useState("");
  const [tracks, settracks] = useState([]); //it will be use to get value of track to replace mock
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState("");

  useEffect(() => {
    const GetEvents = async () => {
      setloading(true);

      try {
        const Response = await axios.get(`${API}/GetEvents`);
        const info = Response.data;
        if (!info.data || info.data.length === 0) {
          seterror(
            Response.Error?.message || "No events available at the moment"
          );
          setTimeout(() => {
            seterror("");
          }, 4000);
          setsuccess("");
          setloading(false);
          return;
        } else {
          setEvents(info.data);
          setsuccess(Response.data?.message || "Events fetched successfully");
          seterror("");
          setTimeout(() => {
            setsuccess("");
          }, 4000);
          setloading(false);
        }
      } catch (Error) {
        seterror(Response.Error?.message || "fail to get data", Error);
        setTimeout(() => {
          seterror("");
        }, 4000);
        setsuccess("");
        setloading(false);
      }
    };
    GetEvents();
  }, []);

  const handleeventclick = async (eventid) => {
    const findevent = Events.find((event) => event._id == eventid);
    settracks(findevent ? findevent.eventtracks : []);
    setselectedeventid(eventid);
    setValue(eventid);
  };

  const handletrackselected = async (trackid) => {
    settrackvalue(trackid);
    setselectedtrackid(trackid);
  };

  return (
    <div className={style.container}>
      <label className={style.title}>{label}</label>
      <div className={style.inputsubtitle}>
        <select
          className={style.selected}
          value={value}
          onChange={(event) => handleeventclick(event.target.value)}
        >
          <option value="">All events </option>
          {Events.map((option) => (
            <option className={style.title} key={option._id} value={option._id}>
              {option.eventname}
            </option>
          ))}
        </select>

        {selectedeventid && (
          <select
            value={trackvalue}
            onChange={(event) => handletrackselected(event.target.value)}
            className={style.selected2}
          >
            <option value="">select track </option>
            {tracks.map((option) => (
              <option key={option._id} value={option._id}>
                {" "}
                {option.trackName}{" "}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Trackchoice;
