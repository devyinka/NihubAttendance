 "use client"
 import { useRouter } from "next/navigation"
 import { useContext, useEffect, useState } from "react"
 import Image from "next/image"
 import style from "./ManageEvent.module.css"
 import Header from "@/public/src/components/AddEventPageComponents/header"
 import  data from "@/public/src/components/AddEventPageComponents/backendresponsemock"// mock data that serve as backend response
import axios from "axios"
import Input from "@/public/src/components/manageEventpagecomponents/forminput"
import DescribeInput from "@/public/src/components/manageEventpagecomponents/Descriptioninput"
import Scroll from "@/public/src/components/scroll"
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex"


const ManageEvent=()=>{
const Navigation=useRouter()
const {Role}=useContext(Rolecontex)

 let [button,setbutton]=useState("manage");
 const [event,setevent]=useState(data)
 const [edit, setedit]=useState(false)
 const [eventname,seteventname]=useState("")
 const [eventlocation,seteventlocation]=useState("")
 const [eventcapacity,seteventcapacity]=useState()
 const [eventdate, seteventdate]=useState("")
 const [eventdescribe, seteventdescribe]=useState("")
 const [eventimageurl, seteventimageurl]=useState("")
 const [editedeventid,seteditedeventid]=useState()
 const [deleteevent, setdeleteevent]=useState({});//  to handle delete event in a map
 const [error, seterror]=useState("")
 const [success,setsuccess]=useState("")
 const [loading, setloading]=useState()


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

//to handle calcle button of modal box 
const handleediteventcancle=()=>{
  setedit(false)
}

const handleedit=(id)=>{
 setedit(true)
 seteditedeventid(id)
}

//to change status of event to open or closed  and send the status value to backend
const handlestatuschange= async (statusid)=>{
  setloading(true)
  const update=event.map((result)=>{
  if(result.id==statusid){
    return {...result, status: !result.status}
    }
    return result
  })
  setevent(update);

  try{
  const response=await axios.put(/*BACKendurlto updatestatus */
    {statusid,
    status:event.find((item)=>item.id===statusid).status 
  })
    setsuccess("data has been succesfully sent")
    seterror("")
    setloading(false)
    return response.data
  }
  catch(error){
    seterror("")
    setsuccess("")
    setloading(false)
    return;
  }
}
  

//to save the updated event once the saved button of the drop down box of edit input is click
const handlesaveedit= async ()=>{
 setloading(true)
 const update=event.map((result)=>{
 if(result.id===editedeventid){
   return {...result,
          name:eventname, 
          imageurl:eventimageurl, 
          programDescription:eventdescribe,
          Register:eventcapacity,
          date:eventdate}
}
    return result
})

setevent(update);

try{
  const response=await axios.put(/*"BAckENDAPIforupdate*/
  {
  id:editedeventid,
  name:eventname, 
  imageurl:eventimageurl, 
  programDescription:eventdescribe,
  Register:eventcapacity,
  date:eventdate
  })
  setsuccess("data has been succesfully sent")
  seterror("")
  setloading(false)
    // return response.data // i will uncomment this once i integrate with the backend }catch(eror){
  seterror("your data is not save",error)
  setsuccess("")
  console.error("Error during log in",error)
  setloading(false)
}catch{
  seteventname("")
  seteventdate("")
  seteventcapacity()
  seteventlocation("")
  seteventdescribe("")
  seteventimageurl("")
  setedit(false)
}
}

//To delete event with its Tracks info once delete button is click
const handledeletevent= async (deleteid)=>{
 setdeleteevent({...deleteevent,[deleteid]:true})

const updated=event.filter(eventinfo=>eventinfo.id !==deleteid)
 try{
  const response=await axios.delete(/*BACKENDURL TO DELETE */{
  data:deleteid
 }) 

  // setdeleteevent({...deleteevent,[deleteid]:true})
  setsuccess("the data has been successfullly delete")
  seterror("")
  return
  }
  catch(error){
  seterror("unable to delete",error)
  setsuccess("")
  setloading(false)    
  }
  setevent(updated)
}


return(
  
<div>
  <Header info="manage event"/>
    <div className={style.container}>
      <div className={style.Titleandlogoutcontainer}>
      <div className={style.title}>Admin Dashboard</div>
      <div>
      <button className={style.logoutbox} onClick={handlelogout}>
       <Image src="/logout.svg" width={14} height={14} alt="logouticon" style={{color:"#7741C3"}}/>
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
        {event.map((result)=>(
        <div key={result.id}  className={style.list}>
        <div style={{display:"flex"}}>
         <h3 className={style.eventname}>{result.name}</h3>
         <h3 className={style.date} >{result.date}</h3>
         <h3 className={style.register}>/{result.Register}</h3>
         <button className= {result.status?style.statusOpen:style.statusClose}
            onClick={() => handlestatuschange(result.id)}>{result.status? "open":"closed"}</button>
         <button className={style.edit}><Image src="./edit.svg" alt="" width={10} height={10}
            onClick={()=>handleedit(result.id)} /></button>
         <button className={style.delete}>{!deleteevent[result.id]?<Image src="./delete.svg" alt="" width={10} height={10}
            onClick={()=>handledeletevent(result.id)}/>:"wait..."}
         </button>
         </div>
         <hr className={style.hr}/>
         <h1 className={style.track}> Tracks</h1>
         <div>{result.Tracks.map((info)=>(
         <div  key={info.id}>
         <ul className={style.trackslist} >
          <li className={style.trackname}>{info.fullname} </li>
         </ul>
         </div> ))}
         </div>
         </div>
            ))
        }
      </div>
      </div>
      </div>
      </Scroll>
            {/* edited box for inputs*/}
{edit? <div>
  <form>
    <div className={style.modalbox}>
     <button className={style.canclemodal} onClick={handleediteventcancle}>x</button>
      <Input type="text" label="Event title" value={eventname} setValue={seteventname}/>
      <Input type="date" label="Date"  value={eventdate}  setValue={seteventdate}/>
      <Input type="text"  label="Location" value={eventlocation} setValue={seteventlocation}/>
      <Input type="number" label="Event Capacity" value={eventcapacity} setValue={seteventcapacity}/>
      <DescribeInput type="text" label="describe"  value={eventdescribe} setValue={seteventdescribe}/>
      <Input type="text" label="Event-Image-url"  value={eventimageurl} setValue={seteventimageurl}/>
       <div className={style.submit}>
        <button className={style.canclebutton} onClick={handleediteventcancle}>cancle</button> 
        <button className={style.savebutton} onClick={handlesaveedit}>{!loading?"save Changes":"wait..."}</button>
        </div>
      </div>
  </form>
      </div>:null
}
{error && <p className={style.error}>{error}</p>}
{success && <p className={style.sucess}>{success}</p>}
</div>
    )
}

export default ManageEvent