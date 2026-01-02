"use client";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import EventRegistration from "@/public/src/components/landingpagecomponent/Card.component";
import style from "./page.module.css";
import Header from "@/public/src/components/landingpagecomponent/header";
import axios from "axios";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API;
  const [events, setEvents] = useState([]);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState("");
  const [success, setsuccess] = useState("");

  useEffect(() => {
    const GetEvents = async () => {
      setloading(true);

      try {
        const response = await axios.get(`${API}/GetEvents`);
        const info = response.data;
        if (!info.data || info.data.length === 0) {
          seterror(
            response.Error?.message || "No events available at the moment"
          );
          setTimeout(() => {
            seterror("");
          }, 4000);
          setsuccess("");
          setloading(false);
          return;
        } else {
          setEvents(info.data);
          setsuccess(response.data?.message || "Events fetched successfully");
          seterror("");
          setTimeout(() => {
            setsuccess("");
          }, 4000);
          setloading(false);
        }
      } catch (erro) {
        seterror("fail to get data", erro);
        setTimeout(() => {
          seterror("");
        }, 4000);
        setsuccess("");
        setloading(false);
      }
    };
    GetEvents();
  }, []);

  const bottomref = useRef(null);

  const handlescrolltobottom = () => {
    bottomref.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white">
      <div>
        <Header info="Admin" />
      </div>
      <div>
        <div className={style.background}>
          <Image
            src="/image.png"
            alt=""
            width={1336}
            height={600}
            priority
            style={{ objectFit: "cover", zIndex: 0 }}
          />
          <div className="absolute inset-0 z-1 pointer-events-none bg-[rgba(100,65,195,0.19)] "></div>
          <div className="absolute flex flex-col  w-full item-center inset-0 z-10 h-full   justify-center pl-4 ">
            <div className=" text-center  text-white  font-mono font-bold text-xs sm:text-sm md:text-2xl lg:text-4xl mt-5  md:mt-10 flex flex-col items-center  md:gap-0 mr-50 ml-1 lg:mr-210 md:mr-120 pl-6 lg:pl-50 md:pl-10">
              <h1 className="m-0 whitespace-nowrap ">Welcome to NIHUB</h1>
              <h1 className=" m-0">Events</h1>
            </div>
            <div className="justify-self-center   text-white flex mr-3 ml-3 text-xs   top-14 font-mono lg:top-55 lg:ml-1 lg:text-3xl md:top-37 md:text-xl leading-none lg:leading-normal ">
              <h1>
                Discover and Register for existing tech event workshops
                bootcamps hosted by NITDA HUB henhance your skills and connect
                with your fellow tech enthusiasts
              </h1>
            </div>
            <div className=" ml-10 mt-1 lg:ml-60 md:ml-25 lg:mt-4">
              <button
                className="text-xs bg-[#7741c3]  w-[35%] lg:w-[20%]  py-[0.8%] px-0.5 rounded-lg "
                onClick={handlescrolltobottom}
              >
                explore events
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[#7741c3] text-center font-mono text-xs font-normal justify-center  absolute bg-white place-self-center w-[80%] flex flex-wrap flex-col">
        <h1 className="text-sm font-bold md:text-2xl lg:text-3xl">
          Available Events
        </h1>
        <h3 className="text-[70%] md:text-[100%] lg:text-[120%]">
          Browse and register for an upcoming events{" "}
        </h3>
      </div>
      <div className={style.eventcontainer}>
        <EventRegistration data={events} />
      </div>
      {error && <p className={style.error}>{error}</p>}
      {success && <p className={style.sucess}>{success}</p>}
      <div ref={bottomref}></div>
    </div>
  );
}
