"use client"
import axios from "axios"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./Addevent.module.css"
import { useState } from "react"
import Input from "@/public/src/components/AddEventPageComponents/Forminput";
import Header from "@/public/src/components/AddEventPageComponents/header";
import DescribeInput from "@/public/src/components/AddEventPageComponents/Descriptioninput";
import Scroll from "@/public/src/components/scroll";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import { useContext } from "react";

const AddEvent=()=>{
  const Navigation=useRouter()
    const {Role}=useContext(Rolecontex)
    let [button,setbutton]=useState("create");// I used let for this because i want to change the value along the way
    const [eventname, seteventname]=useState("")    
    const [eventdate, seteventdate]=useState("")
    const [eventlocation, seteventlocation]=useState("")
    const [eventdescription, seteventdescription]=useState("")
    const [eventcapacity, seteventcapacity]=useState("")
    const [eventimageurl, seteventimageurl]=useState(null)
    const [eventstatus, seteventstatus]=useState(true)
    const [trackid, settrackid]=useState("")
    const [trackname, settrackname]=useState("")
    const [trackabbrivation, settrackabbrvation]=useState("")
    const [eventtracks, seteventtracks]=useState([])
    const [eventcollections , seteventcollections]=useState([])
    const [error, seterror]=useState("")
    const [success, setsuccess]=useState("")
    const [loading, setloading]=useState(false);
    const [dropdown, setdropdown]=useState(false)

  let id=0;

const handleAttendancepage=(change)=>{
  Navigation.push("./Attendance")
  setbutton(change);
}

const handlecreatepage=(change)=>{
  Navigation.push("./AddEvent")
  setbutton(change)
}

const handlemanagepage=(change)=>{
  Navigation.push("./ManageEvent")
  setbutton(change)
}

const handlesubadmnpage=(change)=>{
  Navigation.push("./subadmin")
  setbutton(change)
}


const handlelogout=()=>{
  Navigation.push("./")
}

//handle form dropdown to add tracks of the evet
const handledropdown=()=>{
  setdropdown(!dropdown);

}


// use to store the track in an event collection and make trackvariable empty after that
const handleaddtrack=()=>{
  const   newtrack={
    trackid:trackid,
    trackabbrivation:trackabbrivation,
    trackname:trackname
  }

  //save all the available tracks for each event
  seteventtracks([...eventtracks, newtrack])

  if(!trackid || !trackabbrivation || !trackname ){
    seterror("Please fill in all required fields.")
    setTimeout(() => seterror(null), 4000);
    setdropdown(true)
    return;
}
else{
  setdropdown(false)
}
}


//to submit event and its tracks once it is completed
const handlesubmit= async (event) =>{
 event.preventDefault();
 setloading(true)        
 if(!eventname || !eventdate || !eventlocation || !eventdescription){
   seterror("Please fill in all required fields.")
   setTimeout(() => seterror(null), 4000);
   setsuccess("")
   setloading(false)
   return;
  }   
try{
  
      seteventcollections([{...eventcollections},{
        id:id++,
        eventname,
        eventdate,
        eventdescription,
        eventlocation,
        eventcapacity,
        eventimageurl,
        eventstatus,
        eventtracks:eventtracks? eventtracks: null
      } ])

      seteventname("")
      seteventdate("")
      seteventdescription("")
      seteventcapacity("")
      seteventlocation("")
      seteventcapacity("")
      seteventimageurl("")
      seteventstatus(false)
      seteventtracks([])
      settrackname("")
      settrackid("")
      settrackabbrvation("")

 const Response= await axios.post("BACKENDURL",eventcollections);
      setloading(false)
      setsuccess("your data has been successfully saved")
      return Response.data
  }
  catch(error){
   seterror("Backend require")
   setsuccess("")
   console.error("Error during log in",error)
   setloading(false)
   return;
  }
}

return(
  <div>
  <Header info="Create Event"/>
  <div className={style.container}>
  <div className={style.Titleandlogoutcontainer}>
  <div className={style.title}>Admin Dashboard</div>
    <div>
      <button onClick={handlelogout} className={style.logoutbox}>
      <Image src="/logout.svg" width={14} height={14} alt="logouticon"/>
      <div className={style.logout} >  logout</div>
      </button>
    </div>
  </div>
  <h4 className={style.subtitle}>Manage events, attendance, and sub-admin requests. </h4>       
  </div>
   { Role=="Admin"? <div className={style.buttonscontainer}>
        <button className={button=="create"? style.Active: ""}  onClick={()=>handlecreatepage("create")}> Create events</button>
        <button className={button=="manage"? style.Active: ""}  onClick={()=>handlemanagepage("manage")}>Manage events</button>
        <button className={button=="Attendance"? style.Active: ""}  onClick={()=>handleAttendancepage("Attendance")}>Attendance</button>
        <button className={button=="subadmin"? style.Active: ""} onClick={()=>handlesubadmnpage("subadmin")}>Sub-Admins</button>
   </div>:<div className={style.buttonscontainer}>
        <button className={button=="create"? style.Active: ""}  onClick={()=>handlecreatepage("create")}> Create events</button>
        <button className={button=="manage"? style.Active: ""}  onClick={()=>handlemanagepage("manage")}>Manage events</button>
        <button className={button=="Attendance"? style.Active: ""}  onClick={()=>handleAttendancepage("Attendance")}>Attendance</button></div> }
   <Scroll>
   <div className={style.formcontainer}>
      <h3 className={style.create}>Create New Event</h3>
      <h1 className={style.createsubtitle}>Add a new event to the platform</h1>
      <div className={style.inputcontainer}>
             <Input type="text" label="Event tilte" value={eventname} setValue={seteventname} />
             <Input type="date" label="Event date" value={eventdate} setValue={seteventdate}/> 
      </div>
            <DescribeInput type="text" label="Description" value={eventdescription} setValue={seteventdescription}/>
      <div className={style.inputcontainer}>
            <Input type="text" label="Event location" value={eventlocation} setValue={seteventlocation}/>
            <Input type="number" label="Event capacity" value={eventcapacity} setValue={seteventcapacity}/>
      </div>
            <div className={style.inputcontainer2}>
            <Input type="text" label="Event image url" value={eventimageurl} setValue={seteventimageurl}/>
            </div>
            <div className={style.inputcontainer3}>
            <button className={style.button} onClick={handledropdown}>create track</button>
            <button className={style.button} onClick={handlesubmit}>{!loading?"Create Event":"pleasewait.."}</button>
            </div>
  
  {dropdown? ( <div><div className={style.dropdowncontainer}> 
            <Input type="text" label="Track ID" value={trackid} setValue={settrackid}/>
            <Input type="text" label="Trackname" value={trackname} setValue={settrackname}/>
            <Input type="text" label="Track Abbrevation" value={trackabbrivation} setValue={settrackabbrvation}/>
            </div>
            <button className={style.button2} onClick={handleaddtrack}>Add track</button>
            </div>  ):null
  }
    
 </div>
  {error && <p className={style.error}>{error}</p>}
  {success && <p className={style.sucess}>{success}</p>}
  </Scroll>
</div>   
 )

}

export default AddEvent
