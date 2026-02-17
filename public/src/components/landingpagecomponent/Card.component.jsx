"use client";
import Image from "next/image";
import Link from "next/link";

const EventRegistration = ({ data }) => {
  // to filter out inactive event and map through active event to display on the landing page
  return data
    .filter((event) => event.eventstatus)
    .map((event) => (
      <div
        key={event._id}
        className="flex h-full w-43 flex-col rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(55,24,90,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(55,24,90,0.16)] md:w-56 lg:w-72"
      >
        <div className="overflow-hidden rounded-xl bg-[#f7f3ff]">
          <Image
            src={event.eventimageurl}
            alt={event.eventname || "Event image"}
            height={160}
            width={320}
            className="h-28 w-full object-cover sm:h-32"
            unoptimized
          />
        </div>
        <h2 className="mt-3 line-clamp-2 text-center text-xs font-semibold text-[#7741c3] sm:text-sm">
          {event.eventname}
        </h2>
        <div className="mt-3 min-h-[72px] rounded-md bg-[#7741C3]/90 p-2 text-[10px] text-white sm:text-[11px]">
          <h5 className="line-clamp-4">
            {event.eventdescription || "Event details coming soon."}
          </h5>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Image src="/calender.svg" alt="" height={18} width={12} />
          <h4 className="text-[11px] text-[#7741c3] sm:text-xs">
            {event.eventdate}
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <Image src="/location.svg" alt="" height={12} width={12} />
          <h4 className="line-clamp-1 text-[11px] text-[#7741c3] sm:text-xs">
            {event.eventlocation}
          </h4>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <Image src="/people.svg" alt="" height={12} width={12} />
          <h4 className="text-[11px] text-[#7741c3] sm:text-xs">
            {event.eventcapacity}
          </h4>
        </div>
        <Link
          href={`./Registration?Programid=${event._id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-[#7741c3] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#6a39b0] sm:text-xs"
        >
          Register for the event
        </Link>
      </div>
    ));
};
export default EventRegistration;
