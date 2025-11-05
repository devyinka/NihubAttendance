"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"
import style from "./subadmin.module.css"
import Header from "@/public/src/components/AddEventPageComponents/header"
import { useContext, useState } from "react"
import Input from "@/public/src/components/manageEventpagecomponents/forminput"
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex"





const Attendance=()=>{

const Navigation=useRouter()
const {Role}=useContext(Rolecontex)
let [button, setbutton]=useState("subadmin")
const [subadminfullname, setsubadminfullname]=useState("")
const [subadminemail, setsubadminemail]=useState("")
const [subadminpassword, setsubadminpassword]=useState("")
const [deleteadmin, setdeleteadmin]=useState({})
const [error, seterror]=useState("")
const [sucess, setsuccess]=useState("")
const [loading, setloading]=useState("")
const [edit, setedit]=useState(false)
const [ mocksub, setmocksub]=useState([{
  ID:1,
  Subname:"Abdul Rahamon",
  Email:"Abdul Rahamon@gmail.com"
},
  {ID:2,
  Subname:"Abdul Roheem",
  Email:"Abdulroheem@gmail.com"
},
 {ID:3,
  Subname:"clement philip",
  Email:"Clementphilipe@gmail.com"
},
 {ID:4,
  Subname:"ololade paul",
  Email:"ololadepaul@gmail.com"
}
]
)








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

const handledlete= async (deleteid)=>{
  setloading(true)
  setdeleteadmin({...deleteadmin, [deleteid]:true})

const updated=mocksub.filter(Admininfo=>Admininfo.ID !==deleteid)
setmocksub(updated)

 try{ 
  const response=await axios.delete(/*BACKENDURL TO DELETE Admin*/{
    data:deleteid
 }    
) 

  setsuccess("the data has been successfullly delete")
  seterror("")
  setloading(true)
  return
  }
  catch(erro){
  seterror("unable to delete",error)
  setsuccess("")
  setloading(false)    
  }
  setmocksub(updated)
  setdeleteadmin({...deleteadmin, [deleteid]:false})
}

const handleCancleSubAdminCreate=(event)=>{
  event.preventDefault()
  setedit(false)
}

const handlecreatesubadmin=()=>{
  setedit(true)

}


const handlesavesubadmin= async ()=>{

  if(!subadminfullname || !subadminemail ||!subadminpassword){
    seterror("fill all the neccessary detail")
    setsuccess(false)
     setedit(true)
   return
  }
  setloading(true)
  const data={
              ID:mocksub.length+1,
              Subname:subadminfullname,
              Email:subadminemail,
              password:subadminpassword
  }
  mocksub.push(data)
try{
  const response=await axios.post(`${API}/createAdmin`,{
    data
  }
)
setdeleteadmin({...deleteadmin, [deleteid]:false})
seterror("")
setsuccess("new Admin has been sucessfully Added")
setloading(false)
setedit(false)
return
}
catch(error){
 seterror("unable to Add admin")
 setloading(false)
 setsuccess("")
 setedit(false)
}
setsubadminemail("")
setsubadminfullname("")
setsubadminpassword("")
setedit(false)

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
    <div className={style.buttondiv}><button className={style.button} onClick={handlecreatesubadmin}>Create new subadmin</button></div>
    <div className={style.maincontainer}>
      <div className={style.headercontainer}>
           <span>Admin</span>
           <span>Email</span>
           <span>Delete</span>
      </div>
      <hr className={style.hr}/>
       <div> {
         mocksub.map(info=>(
          <div key={info.ID} className={style.headercontainer1}>
            <span>{info.Subname}</span>
           <span>{info.Email}</span>
           <span>{!deleteadmin[info.ID]?<Image src="./delete.svg" alt="" width={10} height={10} 
            onClick={()=>handledlete(info.ID)} className={style.delete}/>:"wait..."}</span>
          </div>
          
         ))
        }</div>
      </div>
      {edit? 
      <form>
      <div className={style.modalcontainer}>
           <button className={style.canclemodal} onClick={handleCancleSubAdminCreate}>x</button>
           <h2 className={style.newadmin}> imag(Create New Sub-Admin)</h2>
           <div><Input type="text" label="Sub-Admin Full Name" value={subadminfullname} setValue={setsubadminfullname}/></div>
           <div><Input type="email" label="Sub-Admin Email" value={subadminemail} setValue={setsubadminemail}/></div>
            <div><Input type="password" label="Sub-Admin Password" value={subadminpassword} setValue={setsubadminpassword}/></div>
            <h2 className={style.password}>make the Password to be atleast 8 characters</h2>
            <div>
              <button className={style.button1} onClick={handlesavesubadmin}>create sub-admin</button>
               <button className={style.button2} onClick={handleCancleSubAdminCreate}>cancle</button>
            </div>
      </div> </form>:""}

   </div>  
    )
}



export default Attendance;