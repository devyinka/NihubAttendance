"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"
import style from "./Attendance.module.css"
import Header from "@/public/src/components/AddEventPageComponents/header"
import { useEffect, useState } from "react"
import Trackchoice from "@/public/src/components/Attendancepagecomponents/Trackchoice"
import Search from "@/public/src/components/Attendancepagecomponents/Searchinput"
import Attendanceinfo from "@/public/src/components/Attendancepagecomponents/Attendanceinfo.card"
import Scroll from "@/public/src/components/scroll"
import { Attendancecontex } from "@/public/src/components/Attendancepagecomponents/Attendancecontex"
import { useContext } from "react"
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex"


const Attendance=()=>{
const {Role}=useContext(Rolecontex)
const {
      selectedtrackid, 
      selectedeventid, 
     error, seterror, studentinfo, setstudentinfo}=useContext(Attendancecontex);


const Navigation=useRouter()

let [button, setbutton]=useState("Attendance")
const [events, setevents]=useState("")
const [search, setsearch]=useState("")
const [matric, setmatric]=useState("")


useEffect(()=>{
setstudentinfo([
  {id:1,
  matricnumber:"2022/1/8156/ENG",
  eventname:"IT program",
  Trackname:"weband mobile",
  status:"absent"
  },

  {id:2,
  matricnumber:"2021/1/8142ENG",
  eventname:"IT program",
  Trackname:"web and mobile",
  status:"absent"
  },
    {id:3,
  matricnumber:"2022/2/8156/BIOS",
  eventname:"IT program",
  Trackname:"weband mobile",
  status:"absent"
  },

  {id:4,
  matricnumber:"2021/1/4352ENG",
  eventname:"IT program",
  Trackname:"web and mobile",
  status:"absent"
  },
    {id:5,
  matricnumber:"2022/1/81587CLI",
  eventname:"IT program",
  Trackname:"weband mobile",
  status:"absent"
  },

  {id:6,
  matricnumber:"2021/1/8152LMK",
  eventname:"IT program",
  Trackname:"web and mobile",
  status:"absent"
  },
    {id:7,
  matricnumber:"2022/1/8156YKL",
  eventname:"IT program",
  Trackname:"weband mobile",
  status:"absent"
  },

  {id:8,
  matricnumber:"2021/1/8152BMC",
  eventname:"IT program",
  Trackname:"web and mobile",
  status:"absent"
  },
    {id:9,
  matricnumber:"2022/1/8156WAFT",
  eventname:"IT program",
  Trackname:"weband mobile",
  status:"absent"
  },

  {id:10,
  matricnumber:"2021/1/8152CSS",
  eventname:"IT program",
  Trackname:"web and mobile",
  status:"absent"
  }
])
},[]
)



const present=studentinfo.filter((data)=>data.status==="present");
const Absent=studentinfo.length > present.length? studentinfo.length-present.length:present.length-studentinfo.length
const Attendancerate=((present.length/studentinfo.length)*100)


const handlelogout=()=>{
  Navigation.push("./")
}

//to navigate to Attendance marking page once the button is click
const handleAttendancepage=(change)=>{
     Navigation.push("./Attendance")
    setbutton(change);
}

//to navigate to create page once the button is click
const handlecreatepage=(change)=>{
  Navigation.push("./AddEvent")
  setbutton(change)
}

//to navigate to manageevent page once the button is click
const handlemanagepage=(change)=>{
  Navigation.push("./ManageEvent")
  setbutton(change)
}

// to navigate to subadmin page once the button is click
const handlesubadmnpage=(change)=>{
  Navigation.push("./subadmin")
  setbutton(change)
  
}



const markallstudentpresent = async ()=>{
  const updated=studentinfo.map(student=>({
    ...student,status:"present"
  }))

setstudentinfo(updated)

try{
  const response=await axios.post(`${API}/student/${selectedeventid}/${selectedtrackid}`, {
    studentinfo
  });
  alert("all attendance has been mark sucessful")
}catch(error){
 seterror("unable to mark the attendance")
}

}

return(  
  <div>
  <Header info="Take attendance"/>
    <div className={style.container}>
      <div className={style.Titleandlogoutcontainer}>
      <div className={style.title}>Admin Dashboard</div>
      <div>
      <button className={style.logoutbox} onClick={handlelogout}>
       <Image src="/logout.svg" width={14} height={14} alt="logouticon"/>
       <div className={style.logout}> logout </div>    
       </button>
       </div>
       </div>
       <h4 className={style.subtitle}>
         Manage events, attendance, and sub-admin requests.
       </h4>
    </div>
        { Role=="Admin"? <div className={style.buttonscontainer}>
        <button className={button=="create"? style.Active: ""}  onClick={()=>handlecreatepage("create")}> Create events</button>
        <button className={button=="manage"? style.Active: ""}  onClick={()=>handlemanagepage("manage")}>Manage events</button>
        <button className={button=="Attendance"? style.Active: ""}  onClick={()=>handleAttendancepage("Attendance")}>Attendance</button>
        <button className={button=="subadmin"? style.Active: ""} onClick={()=>handlesubadmnpage("subadmin")}>Sub-Admins</button>
       </div>:<div className={style.buttonscontainer}>
        <button className={button=="create"? style.Active: ""}  onClick={()=>handlecreatepage("create")}> Create events</button>
        <button className={button=="manage"? style.Active: ""}  onClick={()=>handlemanagepage("manage")}>Manage events</button>
        <button className={button=="Attendance"? style.Active: ""}  onClick={()=>handleAttendancepage("Attendance")}>Attendance</button>
   </div>}
   <Scroll>
   <div className={style.box}>
        <div className={style.scan}>
        <h3 className={style.takeattendance}>Take attendance</h3>
        <button className={style.scan1}>
          <div></div><div>scan QR Code</div></button>
        </div>
        <div className={style.headercontainer}>
          <div style={{display:"flex", flex:"4%"}} ><Trackchoice label= "Select event" value={events} setValue={setevents}/></div>
        <div style={{display:"flex", flex:"4%"}}><Search type="text" label="search students" value={search} setValue={setsearch}/></div> 
         <button  className={style.button} onClick={markallstudentpresent}> mark all present</button>
         <button className={style.download}>down</button>
         </div>

         <div className={style.studentstat}>
           <div className={style.info}>
            <h2>Total Register</h2>
            <h2 style={{textAlign:"center"}}>{studentinfo.length} </h2>
           </div>
           <div className={style.info}>
            <h2 style={{color:"lightgreen"}}>present</h2>
            <h2 style={{textAlign:"center"}}>{present.length}</h2>
           </div>
            <div className={style.info}>
            <h2 style={{color:"red"}}>Absent</h2>
            <h2 style={{textAlign:"center"}}>{Absent}</h2>
           </div>
              <div className={style.info}>
            <h2>Attendance Rate</h2>
            <h2 style={{textAlign:"center"}}>{Attendancerate?Attendancerate:0} %</h2>
           </div>
         </div>
         <div className={style.studentdata}>
          <div className={style.subcontainer}>
            <span className={style.matric} >Matric Number</span>
            <span className={style.event}>Event</span>
            <span className={style.event}>Track</span>
            <span className={style.satus}>Status</span>
          </div>
          <hr className={style.hr}/>
         <Attendanceinfo search={search}/>
         </div>
   </div>
  
</Scroll>
</div>    
    )
}

export default Attendance;