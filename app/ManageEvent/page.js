"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import style from "./ManageEvent.module.css";
import Header from "@/public/src/components/AddEventPageComponents/header";
import AdminDashboardLayout from "@/public/src/GeneralNavComponent";
import axios from "axios";
import Input from "@/public/src/components/manageEventpagecomponents/forminput";
import DescribeInput from "@/public/src/components/manageEventpagecomponents/Descriptioninput";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import {
  useEvents,
  useStudentCounts,
  useUpdateEvent,
  useUpdateEventStatus,
  useDeleteEvent,
  useDeleteTrack,
  useUpdateTrack,
} from "@/app/hooks/useEvents";

const ManageEvent = () => {
  const API = process.env.NEXT_PUBLIC_API;

  const Navigation = useRouter();
  const { Role } = useContext(Rolecontex);
  const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY;

  let [button, setbutton] = useState("manage");
  const [mounted, setMounted] = useState(false);
  const [editevent, seteditevent] = useState(false);
  const [eventname, seteventname] = useState("");
  const [eventlocation, seteventlocation] = useState("");
  const [eventcapacity, seteventcapacity] = useState();
  const [eventdate, seteventdate] = useState("");
  const [eventdescribe, seteventdescribe] = useState("");
  const [photo, setphoto] = useState(null);
  const [editedeventid, seteditedeventid] = useState("");
  const [showmodal, setshowmodal] = useState(false); //  to confirm delete event delete
  const [deletemodal, setdeletemodal] = useState(false); // to confirm track delete
  const [deleteevent, setdeleteevent] = useState({}); //  to handle delete event in a map
  const [LoadingTrack, setLoadingTrack] = useState({}); // conditional rendering ofloading for track delete
  const [selectedDeleteEvent, setSelectedDeleteEvent] = useState(null); // for event that track will be deleting from
  const [deleteeventid, setdeleteeventid] = useState(""); // to track deletedevent
  const [deletetrackid, setdeletetrackid] = useState(""); // to track deletedtracck
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setloading] = useState("");
  const [edittrack, setedittrack] = useState(false); //track editing modal board
  const [edittrackid, setedittrackid] = useState(""); // edit trackid
  const [edittrackname, setedittrackname] = useState("");
  const [edittrackabrevation, setedittrackabrevation] = useState("");

  // React Query hooks for data fetching and mutations
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents();
  const Events = eventsData?.data || [];
  const eventIds = Events.map((evt) => evt._id);
  const { data: eventCounts = {} } = useStudentCounts(eventIds);

  const updateEventMutation = useUpdateEvent();
  const updateEventStatusMutation = useUpdateEventStatus();
  const deleteEventMutation = useDeleteEvent();
  const deleteTrackMutation = useDeleteTrack();
  const updateTrackMutation = useUpdateTrack();

  const uploadImage = async (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "event_images");
    formdata.append("cloud_name", "dnowbob2t");
    try {
      const response = await axios.post(`${CLOUDINARY_URL}`, formdata);
      return {
        URL: response.data.secure_url,
        Public_id: response.data.public_id,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle loading and error states from React Query
  useEffect(() => {
    if (eventsLoading) {
      setloading(true);
    } else {
      setloading(false);
      if (eventsError) {
        seterror("Failed to fetch events");
        setsuccess("");
      } else if (Events.length === 0) {
        seterror("No event available at the moment");
        setsuccess("");
      } else {
        setsuccess(eventsData?.message || "Events fetched successfully");
        seterror("");
      }
    }
  }, [eventsLoading, eventsError, Events, eventsData]);

  //to handle calcle button of modal box
  const handleediteventcancle = () => {
    seteditevent(false);
  };

  // to handle edit button of each event
  const handleedit = (eventid) => {
    seteditevent(true);
    seteditedeventid(eventid);
  };

  // to handle status change of event open or close
  const handlestatuschange = async (eventid) => {
    setloading(true);
    const currentEvent = Events.find((evt) => evt._id === eventid);
    const newStatus = !currentEvent.eventstatus;

    try {
      await updateEventStatusMutation.mutateAsync({
        eventid,
        status: newStatus,
      });
      setsuccess("Event status updated successfully");
      seterror("");
    } catch (error) {
      seterror("Failed to update event status");
      setsuccess("");
    } finally {
      setloading(false);
    }
  };
  //

  // to save edited event details
  const handlesaveedit = async () => {
    let Public_id;
    let eventimageurl = "";
    if (photo) {
      const imagedata = await uploadImage(photo);
      eventimageurl = imagedata.URL;
      Public_id = imagedata.Public_id;
    }
    setloading(true);

    const editedEvent = {
      eventname: eventname,
      eventdate: eventdate,
      eventdescription: eventdescribe,
      eventlocation: eventlocation,
      eventcapacity: eventcapacity,
      eventimageurl: eventimageurl,
      eventimagepublicid: Public_id,
    };

    try {
      await updateEventMutation.mutateAsync({
        id: editedeventid,
        Public_id,
        editedEvent,
      });
      setsuccess("Event updated successfully");
      seterror("");
    } catch (error) {
      seterror("Failed to update event");
      setsuccess("");
    } finally {
      seteventname("");
      seteventdate("");
      seteventcapacity("");
      seteventlocation("");
      seteventdescribe("");
      setphoto(null);
      seteditedeventid("");
      seteditevent(false);
      setloading(false);
    }
  };

  // to display modal for confirmation of delete action for event delete
  const confirmdeleteevent = (deleteid) => {
    if (editevent || edittrack) return; // Prevent delete modal if edit is active
    setshowmodal(true);
    setdeleteeventid(deleteid);
  };

  // to execute when the yes prompt is selected
  const confirmdelete = () => {
    handledeletevent(deleteeventid);
    setshowmodal(false);
  };

  // functionallity for event deletion
  const handledeletevent = async (eventid) => {
    setdeleteevent({ ...deleteevent, [eventid]: true });

    try {
      await deleteEventMutation.mutateAsync(eventid);
      setsuccess("Event deleted successfully");
      seterror("");
    } catch (error) {
      seterror("Failed to delete event");
      setsuccess("");
    } finally {
      setloading(false);
    }
  };

  // to cancle event delete when selecting no
  const handlecancledeleteevent = () => {
    setshowmodal(false);
  };

  // it will display modal that will prompt you select yes or no for you track deleting
  const confirmdeletetrack = (eventid, trackid) => {
    if (editevent || edittrack) return; // Prevent delete modal if edit is active
    setdeletemodal(true);
    setSelectedDeleteEvent(eventid);
    setdeletetrackid(trackid);
  };

  // once this press it will call function that will delete the track and update it locally
  const savedeletetrack = () => {
    handledeletetrack(selectedDeleteEvent, deletetrackid);
    setdeletemodal(false);
  };

  // functionallity to delete track from each event
  const handledeletetrack = async (selectedDeleteEventid, deletetrackid) => {
    setLoadingTrack((prev) => ({ ...prev, [deletetrackid]: true }));

    try {
      await deleteTrackMutation.mutateAsync({
        eventid: selectedDeleteEventid,
        trackid: deletetrackid,
      });
      setsuccess("Track deleted successfully");
      seterror("");
    } catch (err) {
      seterror("Unable to delete the track: " + err.message);
      setsuccess("");
    }

    setLoadingTrack((prev) => ({ ...prev, [deletetrackid]: false }));
    setdeletemodal(false);
  };

  // cancle the prompt for the track delete
  const handlecancletrackdelete = () => {
    setdeletemodal(false);
  };

  // edit track functionalty for each track
  const handleedittrack = (eventid, trackid) => {
    setedittrack(true);
    setedittrackid(trackid);
    seteditedeventid(eventid);
  };

  const handletrackeditcancle = () => {
    setedittrack(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (edittrack || editevent || showmodal || deletemodal) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    }

    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    };
  }, [edittrack, editevent, showmodal, deletemodal]);

  //  track edited saved functionality
  const handlesavetrackedit = async () => {
    setloading(true);

    try {
      await updateTrackMutation.mutateAsync({
        eventid: editedeventid,
        trackid: edittrackid,
        trackName: edittrackname,
        trackabrevation: edittrackabrevation,
      });
      setsuccess("Track updated successfully");
      seterror("");
    } catch (error) {
      seterror("Unable to update track");
      setsuccess("");
    } finally {
      setedittrackabrevation("");
      setedittrackname("");
      setedittrackid("");
      seteditedeventid("");
      setedittrack(false);
      setloading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Header info="manage event" />
      <AdminDashboardLayout
        role={Role}
        activeButton={button}
        setActiveButton={setbutton}
      >
        <div className="mt-2 pt-0.8% mx-1 lg:mx-4 md:mx-6 mb-0.5% rounded-lg border border-gray-200 bg-white">
          <h4 className=" text-[#7741C3] font-bold text-sm lg:text-xl ml-2 mb-1 font-mono mt-2">
            Manage events
          </h4>
          <div className="mt-2 mx-1 lg:mx-4 md:mx-6 mb-0.5% space-y-4">
            {Events.map((result) => {
              const tracks = result.eventtracks;
              return (
                <div
                  key={result._id}
                  className="p-4 md:p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  {/* Event header with info, status, and actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base md:text-lg text-[#7741C3]">
                        {result.eventname}
                      </h3>
                      <div className="flex flex-col md:flex-row md:gap-6 text-xs md:text-sm text-gray-600 mt-2">
                        <p>
                          <span className="font-medium text-gray-700">
                            Date:
                          </span>{" "}
                          {result.eventdate}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            Registered:
                          </span>{" "}
                          {eventCounts[result._id] ?? 0}/{result.eventcapacity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end ml-4">
                      <button
                        onClick={() => handlestatuschange(result._id)}
                        className={
                          result.eventstatus
                            ? "bg-[#7741C3] text-white text-xs px-6 py-1.5 rounded font-medium"
                            : "bg-red-500 text-white text-xs px-3 py-1.5 rounded font-medium"
                        }
                      >
                        {result.eventstatus ? "open" : "closed"}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleedit(result._id)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                          title="Edit event"
                        >
                          <Image
                            src="./edit.svg"
                            alt="Edit"
                            width={16}
                            height={16}
                          />
                        </button>
                        <button
                          onClick={() => confirmdeleteevent(result._id)}
                          disabled={editevent || edittrack}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete event"
                        >
                          {!deleteevent[result._id] ? (
                            <Image
                              src="./delete.svg"
                              alt="Delete"
                              width={16}
                              height={16}
                            />
                          ) : (
                            <span className="text-xs font-medium">wait...</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tracks section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-sm text-[#7741C3] mb-3">
                      Tracks
                    </h4>
                    {tracks && tracks.length > 0 ? (
                      <div className="space-y-2">
                        {tracks.map((info) => {
                          return (
                            <div
                              key={info._id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition"
                            >
                              <span className="font-medium text-sm text-gray-800 truncate">
                                {info.trackName}
                              </span>
                              <div className="flex gap-2 ml-2">
                                <button
                                  onClick={() =>
                                    handleedittrack(result._id, info._id)
                                  }
                                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded transition"
                                  title="Edit track"
                                >
                                  <Image
                                    src="./edit.svg"
                                    alt="Edit"
                                    width={14}
                                    height={14}
                                  />
                                </button>
                                <button
                                  disabled={
                                    LoadingTrack[info._id] ||
                                    editevent ||
                                    edittrack
                                  }
                                  onClick={() =>
                                    confirmdeletetrack(result._id, info._id)
                                  }
                                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete track"
                                >
                                  {!LoadingTrack[info._id] ? (
                                    <Image
                                      src="./delete.svg"
                                      alt="Delete"
                                      width={14}
                                      height={14}
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      ...
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No tracks added yet
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AdminDashboardLayout>

      {/* edited box for inputs*/}
      {editevent ? (
        <div className="fixed inset-0 bg-[#7741C3]/10 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault(), handlesaveedit();
            }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleediteventcancle}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-[#7741C3] mb-4 sm:mb-6 pr-6">
              Edit Event
            </h2>

            {/* Form Inputs */}
            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              <Input
                type="text"
                label="Event title"
                value={eventname}
                setValue={seteventname}
              />
              <Input
                type="date"
                label="Date"
                value={eventdate}
                setValue={seteventdate}
              />
              <Input
                type="text"
                label="Location"
                value={eventlocation}
                setValue={seteventlocation}
              />
              <Input
                type="number"
                label="Event Capacity"
                value={eventcapacity}
                setValue={seteventcapacity}
              />
              <DescribeInput
                type="text"
                label="describe"
                value={eventdescribe}
                setValue={seteventdescribe}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Choose event image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setphoto(event.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
              <button
                type="button"
                onClick={handleediteventcancle}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#7741C3] text-white font-medium rounded-lg hover:bg-[#5a2fa0] transition disabled:opacity-50 text-sm sm:text-base"
                disabled={loading}
              >
                {!loading ? "Save Changes" : "Saving..."}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {edittrack && (
        <div className="fixed inset-0 bg-[#7741C3]/10 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault(), handlesavetrackedit();
            }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 relative"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handletrackeditcancle}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-[#7741C3] mb-4 sm:mb-6 pr-6">
              Edit Track
            </h2>

            {/* Form Inputs */}
            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              <Input
                type="text"
                label="Track full name"
                value={edittrackname}
                setValue={setedittrackname}
              />
              <Input
                type="text"
                label="Track Abbreviation"
                value={edittrackabrevation}
                setValue={setedittrackabrevation}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
              <button
                type="button"
                onClick={handletrackeditcancle}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#7741C3] text-white font-medium rounded-lg hover:bg-[#5a2fa0] transition disabled:opacity-50 text-sm sm:text-base"
                disabled={loading}
              >
                {!loading ? "Save Changes" : "Saving..."}
              </button>
            </div>
          </form>
        </div>
      )}

      {showmodal && (
        <div className="fixed inset-0 bg-[#7741C3]/10 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-bold text-red-600 mb-6">
              Are you sure you want to delete this event?
            </h2>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={handlecancledeleteevent}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmdelete}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {deletemodal && (
        <div className="fixed inset-0 bg-[#7741C3]/10 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-bold text-red-600 mb-6">
              Are you sure you want to delete this track?
            </h2>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={handlecancletrackdelete}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={savedeletetrack}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className={style.error}>{error}</p>}
      {/* {success && <p className={style.sucess}>{success}</p>} */}
    </div>
  );
};

export default ManageEvent;
