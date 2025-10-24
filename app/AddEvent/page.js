"use client"
import axios from "axios"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./Addevent.module.css"
import { useState } from "react"
import Input from "@/public/src/components/AddEventPageComponents/Forminput";
import Header from "@/public/src/components/AddEventPageComponents/header";
import DescribeInput from "@/public/src/components/AddEventPageComponents/Descriptioninput";
import ManageEvent from "../ManageEvent/page";

const AddEvent=()=>{
  const Navigation=useRouter()
    

    let [button,setbutton]=useState("create");// I used let for this because i want to change the value along the way
    const [eventname, seteventname]=useState("")    
    const [eventdate, seteventdate]=useState("")
    const [eventlocation, seteventlocation]=useState("")
    const [eventdescription, seteventdescription]=useState("")
    const [eventcapacity, seteventcapacity]=useState("")
    const [eventimageurl, seteventimageurl]=useState(null)
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
  setbutton(change);
  Navigation.push("./Attendace")
}

const handlecreatepage=(change)=>{
  setbutton(change)
  Navigation.push("./AddEvent")
}

const handlemanagepage=(change)=>{
  setbutton(change)
  Navigation.push("./ManageEvent")
}

const handlesubadmnpage=(change)=>{
  setbutton(change)
  Navigation.push("./subadmin")
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
        eventtracks:eventtracks? eventtracks: null
      } ])

      seteventname("")
      seteventdate("")
      seteventdescription("")
      seteventcapacity("")
      seteventlocation("")
      seteventcapacity("")
      seteventimageurl("")
      seteventtracks([])

    const Response= await axios.post("BACKENDURL",eventcollections);
      setloading(false)
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
     <div className={style.maincontainer}>
       <button className={style.logoutbox} onClick={handlelogout}>
          <Image src="/logout.svg" width={14} height={14} alt="logouticon"/>
          <div className={style.logout}>
          log out
          </div>
    </button>
        <div className={style.titleAndsubtitlecontainer}>
         <h3 className={style.title}>
          Admin Dashboard
          </h3>
          <h4 className={style.subtitle}>
          Manage events, attendance, and sub-admin requests
          </h4>
     </div>
      </div>

    <div className={style.buttonscontainer}>
        <button className={button=="create"? style.Active: ""}  onClick={()=>handlecreatepage("create")}>
          {/* <div className={style.arrange}><Image src="/createEvent.svg" width={10} height={10}/><h4>Create-events</h4></div></button> */}
          Create events
        </button>
        <button className={button=="manage"? style.Active: ""}  onClick={()=>handlemanagepage("manage")}>Manag events</button>
        <button className={button=="Attendance"? style.Active: ""}  onClick={()=>handleAttendancepage("Attendance")}>Attendance</button>
        <button className={button=="subadmin"? style.Active: ""} onClick={()=>handlesubadmnpage("subadmin")}>Sub-Admins</button>
      </div>
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
                        </div>
                        ):null}
            
      </div>
        {error && <p className={style.error}>{error}</p>}
        {success && <p className={style.sucess}>{success}</p>}
</div>
    
 )

}

export default AddEvent
