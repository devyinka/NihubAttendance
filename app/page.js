"use client";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import EventRegistration from "@/public/src/components/landingpagecomponent/Card.component";
import style from "./page.module.css";
import Header from "@/public/src/components/landingpagecomponent/header";
import { useEvents } from "@/app/hooks/useEvents";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");

  // React Query hook for events
  const { data: eventsData, isLoading, error: queryError } = useEvents();
  const events = eventsData?.data || [];
  const loading = isLoading;

  // Handle loading and error states
  useEffect(() => {
    if (queryError) {
      seterror("Failed to fetch events");
      setTimeout(() => seterror(""), 4000);
    } else if (events.length === 0 && !isLoading) {
      seterror("No events available at the moment");
      setTimeout(() => seterror(""), 4000);
    } else if (events.length > 0) {
      setsuccess(eventsData?.message || "Events fetched successfully");
      setTimeout(() => setsuccess(""), 4000);
    }
  }, [events, isLoading, queryError, eventsData]);

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
        <div className="inline-flex relative px-[5%] justify-end items-center bg-[linear-gradient(180deg,rgba(119,65,195,0.5)0%,rgba(57,31,93,0.5)40.23%),url('/image.png')] bg-center bg-cover bg-no-repeat">
          <Image
            className=" lg:w-400  w-full  h-auto object-cover"
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
            <div className=" ml-10 mt-1 lg:ml-60 md:ml-25 lg:mt-4 mb-6 md:mb-3 lg:mb-3">
              <button
                className="text-xs bg-[#7741c3]  w-[35%] lg:w-[20%]  py-[0.8%] px-0.5 rounded-lg  "
                onClick={handlescrolltobottom}
              >
                explore events
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[#7741c3] text-center font-mono text-xs font-normal justify-center  absolute bg-white place-self-center w-[80%] flex flex-wrap flex-col mt-2 lg:mt-2 lg:pt-0   ">
        <h1 className="text-sm font-bold md:text-2xl lg:text-3xl pt-0 pb-1">
          Available Events
        </h1>
        <h3 className="text-[70%] md:text-[100%] lg:text-[120%] mb-8">
          Browse and register for an upcoming events{" "}
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gp-1 lg:gap-3 lg:mt-10 mb-5 mt-6">
        <EventRegistration data={events} />
      </div>
      {error && (
        <p className="text-red-500 text-center font-mono text-sm">{error}</p>
      )}
      <div ref={bottomref}></div>
    </div>
  );
}
