"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import style from "./ManageEvent.module.css";
import Header from "@/public/src/components/AddEventPageComponents/header";
import data from "@/public/src/components/AddEventPageComponents/backendresponsemock"; // mock data that serve as backend response
import axios from "axios";
import Input from "@/public/src/components/manageEventpagecomponents/forminput";
import DescribeInput from "@/public/src/components/manageEventpagecomponents/Descriptioninput";
import Scroll from "@/public/src/components/scroll";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";

const ManageEvent = () => {
  const API = process.env.NEXT_PUBLIC_API;

  const Navigation = useRouter();
  const { Role } = useContext(Rolecontex);
  const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY;

  let [button, setbutton] = useState("manage");
  const [Events, setEvents] = useState([]);
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
  const [eventCounts, setEventCounts] = useState({});

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

  useEffect(() => {
    const GetEvents = async () => {
      setloading(true);

      try {
        const response = await axios.get(`${API}/GetEvents`);
        const info = response.data;
        if (info.data.length === 0) {
          seterror("No event available at the moment");
          setsuccess("");
          setloading(false);
          return;
        } else {
          setEvents(info.data);
          setsuccess(response.data?.message || "Events fetched successfully");
          seterror("");
          setloading(false);
        }
      } catch (erro) {
        seterror("fail to get data frombackend data", erro);
        setsuccess("");
        setloading(false);
      }
    };
    GetEvents();
  }, []);

  // fetch student counts per event
  useEffect(() => {
    const fetchCounts = async () => {
      if (!Events || Events.length === 0) return;
      try {
        const entries = await Promise.all(
          Events.map(async (evt) => {
            try {
              const resp = await axios.get(
                `${API}/GetNumberOfStudentsOnevent`,
                {
                  params: { eventid: evt._id },
                }
              );
              return [evt._id, resp?.data.studentcount ?? 0];
            } catch (err) {
              return [evt._id, 0];
            }
          })
        );
        setEventCounts(Object.fromEntries(entries));
      } catch (_) {
        // ignore aggregate errors
      }
    };
    fetchCounts();
  }, [API, Events]);
  //
  const handlelogout = async () => {
    setloading(true);
    try {
      await axios.post(`${API}/logout`);
    } catch (err) {
      seterror("unable to log out " + err.message);
    }
    Navigation.push("/");
    setloading(false);
  };

  //to navigate to Attendance marking page once the button is click
  const handleAttendancepage = (change) => {
    Navigation.push("./Attendance");
    setbutton(change);
  };

  //to navigate to create page once the button is click
  const handlecreatepage = (change) => {
    Navigation.push("./AddEvent");
    setbutton(change);
  };

  //to navigate to manageevent page once the button is click
  const handlemanagepage = (change) => {
    Navigation.push("./ManageEvent");
    setbutton(change);
  };

  // to navigate to subadmin page once the button is click
  const handlesubadmnpage = (change) => {
    Navigation.push("./subadmin");
    setbutton(change);
  };

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
    const update = Events.map((result) => {
      if (result._id == eventid) {
        return { ...result, eventstatus: !result.eventstatus };
      }
      return result;
    });

    // setEvents(update);
    try {
      const response = await axios.put(`${API}/UpdateEventStatus`, {
        eventid,
        status: update.find((item) => item._id === eventid).eventstatus,
        // status: Events.find((item) => item._id === statusid).eventstatus,
      });
      if (response.data.message) {
        setsuccess(response.data.message);
      }
      seterror("");
      setloading(false);
      setEvents(update); // update state with new status
      return;
    } catch (error) {
      seterror("");
      setsuccess("");
      setloading(false);
      return;
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
      const Response = await axios.put(`${API}/UpdateEvent`, {
        id: editedeventid,
        Public_id,
        editedEvent,
      });
      if (Response.data.message) {
        setsuccess(Response.data.message);
        seterror("");
        setloading(false);
        setEvents((prevEvents) =>
          prevEvents.map((prev) =>
            prev._id === editedeventid ? Response.data.data : prev
          )
        );
      }
      seterror("");
      setloading(false);
    } catch (error) {
      seteventname("");
      setloading(false);
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

    const updated = Events.filter((eventinfo) => eventinfo._id !== eventid);
    try {
      const response = await axios.delete(`${API}/DeleteEvent`, {
        data: { eventid },
      });

      if (response.data.message) {
        setsuccess(response.data.message);
        seterror("");
        setEvents(updated);
        setloading(false);
      }
    } catch (error) {
      seterror("unable to delete", error);
      setsuccess("");
      setloading(false);
    }
  };

  // to cancle event delete when selecting no
  const handlecancledeleteevent = () => {
    setshowmodal(false);
  };

  // it will display modal that will prompt you select yes or no for you track deleting
  const confirmdeletetrack = (eventid, trackid) => {
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

    const updatedEvents = Events.map((evt) => {
      if (evt._id === selectedDeleteEventid) {
        return {
          ...evt,
          eventtracks: evt.eventtracks.filter(
            (track) => track._id != deletetrackid
          ),
        };
      }
      return evt;
    });

    try {
      const Response = await axios.delete(`${API}/DeleteTrack`, {
        data: {
          eventid: selectedDeleteEventid,
          trackid: deletetrackid,
        },
      });
      if (Response.data.message) {
        setEvents(updatedEvents);
        setsuccess(Response.data.message);
        seterror("");
      }
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

  //  track edited saved functionality
  const handlesavetrackedit = async () => {
    setloading(true);
    const update = Events.map((result) => {
      const updatedTracks = result.eventtracks.map((trackinfo) => {
        if (trackinfo._id === edittrackid && result._id === editedeventid) {
          return {
            ...trackinfo,
            trackName: edittrackname,
            trackAbbreviation: edittrackabrevation,
          };
        }

        return trackinfo;
      });
      // return the event with updated tracks
      return { ...result, eventtracks: updatedTracks };
    });

    try {
      const Response = await axios.put(`${API}/UpdateEventTracks`, {
        eventid: editedeventid,
        trackid: edittrackid,
        trackName: edittrackname,
        trackAbbreviation: edittrackabrevation,
      });
      if (Response.data.message) {
        setEvents(update);
        setsuccess(Response.data.message);
        seterror("");
      }

      setloading(false);
    } catch (error) {
      seterror("unable to update", error);
      setloading(false);
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

  return (
    <div>
      <Header info="manage event" />
      <div className={style.container}>
        <div className={style.Titleandlogoutcontainer}>
          <div className={style.title}>Admin Dashboard</div>
          <div>
            <button className={style.logoutbox} onClick={handlelogout}>
              <Image
                src="/logout.svg"
                width={14}
                height={14}
                alt="logouticon"
                style={{ color: "#7741C3" }}
              />
              <div className={style.logout}> logout </div>
            </button>
          </div>
        </div>
        <h4 className={style.subtitle}>
          Manage events, attendance, and sub-admin requests.
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
        <div className={style.box}>
          <h4 className={style.text}>Manage events</h4>
          <div className={style.subbox}>
            <div className={style.headercontainer}>
              <span className={style.eventtitle}>Title</span>
              <span className={style.events}>Date</span>
              <span className={style.events}>Registers</span>
              <span className={style.events}>status</span>
              <span className={style.events}>Edit</span>
              <span className={style.events}>Delete</span>
            </div>
            <div>
              {Events.map((result) => {
                const tracks = result.eventtracks;
                return (
                  <div key={result._id} className={style.list}>
                    <div style={{ display: "flex" }}>
                      <h3 className={style.eventname}>{result.eventname}</h3>
                      <h3 className={style.date}>{result.eventdate}</h3>
                      <h3 className={style.register}>
                        {eventCounts[result._id] ?? 0} /{result.eventcapacity}
                      </h3>
                      <button
                        className={
                          result.eventstatus
                            ? style.statusOpen
                            : style.statusClose
                        }
                        onClick={() => handlestatuschange(result._id)}
                      >
                        {result.eventstatus ? "open" : "closed"}
                      </button>
                      <button className={style.edit}>
                        <Image
                          src="./edit.svg"
                          alt=""
                          width={10}
                          height={10}
                          onClick={() => handleedit(result._id)}
                        />
                      </button>
                      <button className={style.delete}>
                        {!deleteevent[result._id] ? (
                          <Image
                            src="./delete.svg"
                            alt=""
                            width={10}
                            height={10}
                            onClick={() => confirmdeleteevent(result._id)}
                          />
                        ) : (
                          "wait..."
                        )}
                      </button>
                    </div>
                    <hr className={style.hr} />
                    <h1 className={style.track}>Tracks</h1>
                    <div className={style.namelist}>
                      {tracks
                        ? tracks.map((info) => (
                            <ul key={info._id} className={style.trackslist}>
                              <li className={style.trackname}>
                                {info.trackName}
                              </li>
                              <div className={style.action}>
                                <button>
                                  <Image
                                    src="./edit.svg"
                                    alt=""
                                    width={10}
                                    height={10}
                                    onClick={() =>
                                      handleedittrack(result._id, info._id)
                                    }
                                    className={style.deleteaction}
                                  />
                                </button>
                                <button
                                  className={style.deleteaction}
                                  disabled={LoadingTrack[info._id]}
                                >
                                  {!LoadingTrack[info._id] ? (
                                    <Image
                                      src="./delete.svg"
                                      alt=""
                                      width={10}
                                      height={10}
                                      onClick={() =>
                                        confirmdeletetrack(result._id, info._id)
                                      }
                                    />
                                  ) : (
                                    "wait..."
                                  )}
                                </button>
                              </div>
                            </ul>
                          ))
                        : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Scroll>

      {/* edited box for inputs*/}
      {editevent ? (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault(), handlesaveedit();
            }}
          >
            <div className={style.modalbox}>
              <button
                className={style.canclemodal}
                onClick={handleediteventcancle}
              >
                x
              </button>
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
              <div className={style.inputcontainer2}>
                <label className={style.eventimagetitle}>
                  chose event image
                </label>
                <div className={style.eventimagesubtitle}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setphoto(event.target.files[0])}
                  />
                </div>
              </div>
              <div className={style.submit}>
                <button
                  className={style.canclebutton}
                  onClick={handleediteventcancle}
                >
                  cancle
                </button>
                <button className={style.savebutton} type="submit">
                  {!loading ? "save Changes" : "wait..."}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}

      {edittrack && (
        <form
          onSubmit={(e) => {
            e.preventDefault(), handlesavetrackedit();
          }}
        >
          <div className={style.modalbox}>
            <button
              className={style.canclemodal}
              onClick={handletrackeditcancle}
            >
              x
            </button>
            <Input
              type="text"
              label="Track full name"
              value={edittrackname}
              setValue={setedittrackname}
            />
            <Input
              type="text"
              label="Track Abrrevation"
              value={edittrackabrevation}
              setValue={setedittrackabrevation}
            />
            <div className={style.submit}>
              <button
                className={style.canclebutton}
                onClick={handletrackeditcancle}
              >
                cancle
              </button>
              <button className={style.savebutton} type="submit">
                {!loading ? "save Changes" : "wait..."}
              </button>
            </div>
          </div>
        </form>
      )}

      {showmodal && (
        <div className={style.confirmdelete}>
          <h2 className={style.warning}>
            {" "}
            Are you sure you want to delete this event
          </h2>
          <button onClick={confirmdelete} className={style.deletebutton}>
            Yes
          </button>
          <button
            onClick={handlecancledeleteevent}
            className={style.deletebutton}
          >
            NO
          </button>
        </div>
      )}
      {deletemodal && (
        <div className={style.confirmdelete}>
          <h2 className={style.warning}>
            {" "}
            Are you sure you want to delete this track
          </h2>
          <button onClick={savedeletetrack} className={style.deletebutton}>
            Yes
          </button>
          <button
            onClick={handlecancletrackdelete}
            className={style.deletebutton}
          >
            NO
          </button>
        </div>
      )}

      {error && <p className={style.error}>{error}</p>}
      {success && <p className={style.sucess}>{success}</p>}
    </div>
  );
};

export default ManageEvent;

// const update = Events.map((result) => {
//   if (result._id == editedeventid) {
//     return {
//       ...result,
//       name: eventname,
//       imageurl: eventimageurl,
//       programDescription: eventdescribe,
//       Register: eventcapacity,
//       date: eventdate,
//     };
//   }
//   return result;
// });
