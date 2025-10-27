"use client"
import { useEffect } from "react";
import axios from "axios";
import Header from "@/public/src/components/RegistrationPageComponents/header";
import style from "./Registration.module.css"
import { useRouter, useSearchParams  } from "next/navigation";
import { useState } from "react"
import Input from "@/public/src/components/RegistrationPageComponents/forminput";
import Trackchoice from "@/public/src/components/RegistrationPageComponents/Trackchoice";


const Registration=()=>{
    const Navigation=useRouter()
    const searchParams = useSearchParams()
    const Programid = searchParams.get('Programid');

// In other to store URL parameter to send each program to its own end point.
const [Query, SetQuery] = useState(null);

 useEffect(() => {
    if (Programid) {
      SetQuery(Programid);
    }
  }, [Programid]);


    const [fullname, setfullname]=useState("")
    const [matricnumber, setmatricnumber]=useState("")
    const [email, setemail]=useState("")
    const [department, setdepartment]=useState("")
    const [gender, setgender]=useState("")
    const [track, settrack]=useState("")
    const [photo, setphoto]=useState("")
    const [Error, seterror]=useState("")
    const [success, setsuccess]=useState("")
    const [loading, setloading]=useState(false)

    const handlegoback=()=>{
        Navigation.push("./")
    }

    const Handlesubmit= async (event) =>{
    event.preventDefault();
    setloading(true)
    if(!fullname || !matricnumber || !email || !department || !gender || !track || !photo){
        seterror("Please fill in all required fields.")
        setsuccess("")
        setloading(false)
        
        return;
    }
    
    const formdata=new FormData();
    formdata.append("fullname", fullname)
    formdata.append("matricnumber", matricnumber)
    formdata.append("email", email)
    formdata.append("department", department)
    formdata.append("gender", gender)
    formdata.append("track", track)
    formdata.append("photo", photo) 

    try{    
        const response=await axios.post(`BACKEND-URL/${Programid}`, formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            }  
        }
    );

        setsuccess("Registration successful!")
        seterror("")  
        setloading(false)  
        return    

    }catch(error){
        seterror("Registration failed. Please try again.")
        setsuccess("")
        console.error("Error during registration:", error)
        setloading(false)
        return;
    }  
}       

    return(
        <div>
        <div className={style.Header}>
        <Header/>
        </div>
          <button className={style.backbotton} onClick={handlegoback}>
            Back to Events
          </button>
        <div className={style.container}>
            <h3 className={style.title}>Event Registration</h3>
            <h4 className={style.subtitle}>Please fill in your details to register for this event </h4>
         <form>
               <Input type="text" label="Fullname" value={fullname} setValue={setfullname}/>
                <Input type="text" label="Matric number" value={matricnumber} setValue={setmatricnumber}/>
                <Input type="email" label="Email" value={email} setValue={setemail}/>
                <Input type="text" label="Department" value={department} setValue={setdepartment}/>
               
         <label className={style.title}>
            Gender
         </label>
                <div className={style.subtitle}>
                <select style={{border:"none", outline:"none"}} value={gender} onChange={(event) => setgender(event.target.value)}>
                    <option value="">Select Gender</option>
                    <option className={style.title} value="male">Male</option>
                    <option  className={style.title} value="female">Female</option>
                </select>
                </div>
                                                                    
         <Trackchoice label="Select your Track" value={track} setValue={settrack} BACKendURl={`BACKenURL/${Query}`}/>
                
                <label className={style.title}>Upload your Passport Photograph</label>
                <div className={style.subtitle}>
                <input type="file" accept="image/*" onChange={(event) => setphoto(event.target.files[0])}/> 
                </div>
                <button className={style.submitbutton} onClick={Handlesubmit}>{!loading ?"Register": "please wait..."}</button>
                {Error && <p className={style.error}>{Error}</p>}
                {success && <p className={style.success}>{success}</p>} 
               
         </form>
         </div>
         </div>

    )
}
export default Registration;