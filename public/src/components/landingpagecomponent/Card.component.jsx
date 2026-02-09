"use client";
import Image from "next/image";
import style from "./Card.module.css";
import Link from "next/link";

const EventRegistration = ({ data }) => {
  // to filter out inactive event and map through active event to display on the landing page
  return data
    .filter((event) => event.eventstatus)
    .map((event) => (
      <div
        key={event._id}
        className="w-40 md:w-50  lg:w-68 bg-[#F9FAFB] rounded-lg p-4 mx-0.2 shadow-lg hover:shadow-xs transition-shadow duration-300 mt-10"
      >
        <Image
          src={event.eventimageurl}
          alt="image"
          height={100}
          width={236}
          unoptimized
        />
        <h2 className=" text-[#7741c3] text-center text-xs font-mono m-1">
          {event.eventname}
        </h2>
        <div className="flex flex-wrap text-start text-xs h-30 overflow-hidden text-ellipsis my-2 p-2 bg-[#7741C3] text-white rounded-md">
          <h5>{event.eventdescription}</h5>
        </div>
        <div className="flex items-center  text-xs gap-2 lg:mt-2 md:mt-2 lg:mb-1 md:mb-1 my-0.2">
          <Image src="/calender.svg" alt="" height={25} width={10} />
          <h4 className="text-[#7741c3] font-mono text-xs ">
            {event.eventdate}
          </h4>
        </div>
        <div className="flex items-center  text-xs gap-2 lg:mt-2 md:mt-2 lg:mb-1 md:mb-1 my-0.2">
          <Image src="/location.svg" alt="" height={10} width={10} />
          <h4 className="text-[#7741c3] font-mono text-sm">
            {event.eventlocation}
          </h4>
        </div>
        <div className="flex items-center  text-xs gap-2 lg:mt-2 md:mt-2 lg:mb-1 md:mb-1 my-0.2">
          <Image src="/people.svg" alt="" height={10} width={10} />
          <h4 className="text-[#7741c3] font-mono text-sm">
            {event.eventcapacity}
          </h4>
        </div>
        <div className={style.button}>
          <Link href={`./Registration?Programid=${event._id}`}>
            Register for the event
          </Link>
        </div>
      </div>
    ));
};
export default EventRegistration;
