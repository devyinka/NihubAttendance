"use client"
import { useRouter } from "next/navigation";
import React from "react"
import { useState } from "react"
import axios from "axios";
import Header from "@/public/src/components/AdminLoginpageComponents/header";
import style from "./page.module.css"
import Input from "@/public/src/components/AdminLoginpageComponents/Forminput";



const Login=()=>{

const Navigation=useRouter()

const handlegoback=()=>{
  Navigation.push("./")
}

let [Role,setRole]=useState("Admin");// i used let for this because i want to change the value along the way
const [Email, setEmail]=useState("Admin@gmail.com");  
const [SubEmail, setSubEmail]=useState("Sub-Admin@gmail.com")
const [Password, setPassword]=useState("");
const [Username, setUsername]=useState("SubAdmin");
const [Error, setError]=useState("");
const [Success, SetSuccess]=useState("")
const [loading, setloading]=useState(false)
const [userdata, setuserdata]=useState({});



// to change Admin to Sub-Admin
const handleRoleChange=(newRole)=>{
  setRole(newRole);
  setloading(false)
  setError("")
}


const handlesubmit= async (event)=>{
  event.preventDefault();
  setloading(true)

  if(!Email|| !Password && Role=="Admin" ){
    setError("Fill all the neccessary details")
    SetSuccess("")
    setloading(false)
    return;
  };

  if(!Email || !Password || !Username && Role=="SubAdmin" ){
    setError("you are required to input all your details")
    setTimeout(() => setError(null), 4000);
    SetSuccess("")
    setloading(false)
    return
  }

  if(Role=="Admin"){
   setuserdata({
   Email,
   Password})
   }
   else{
    setuserdata({
      Username,
      Email,
      Password})
    }

  try{
  
   const Response= await axios.post("BACKENDURL",userdata);
   SetSuccess("you are now login")
   setError("")
   setloading(false)
  return Response.data
   
  }
  catch(error){
   setError("Backend require")
   SetSuccess("")
   console.error("Error during log in",error)
   setloading(false)
   return;
  }

  if(!Success){
   Navigation.push("/Registration")
  }
}



    return(
        <div>
        <Header info={"Admin login"}/>
        <div> 
        <button className={style.backbotton} onClick={handlegoback}>
            Back to Events
        </button>
        </div>
        <div className={style.container}>
        <h2 className= {style.Login}>Login</h2>
        <h6 className={style.subtitle}>Sign in to access the admin dashboard</h6>
               <div className={style.Role}>
               <button className={Role=="Admin"?style.Active:"" }   onClick={()=>handleRoleChange("Admin")}> Admin </button>
               <button className={Role=="SubAdmin" ?style.Active: ""} onClick={()=>handleRoleChange("SubAdmin")}>SubAdmin</button>
              </div>{
               Role=="Admin"? (<form>
                <Input type="Email" label="Email" value={Email} setValue={setEmail}/>
                <Input type="password" label="Password" value={Password} setValue={setPassword}/>
                <button className={style.submit} onClick={handlesubmit} > 
                { !loading? "login As Admin" : "please wait..." }
                </button>
                {Error && <p style={{color:"red",justifySelf:"center"}}>{Error}</p>}
                {Success && <p style={{color:"green", justifySelf:"center"}}>{Success}</p>} 
              </form>):
               (<form>
                  <Input type="text" label="Username" value={Username} setValue={setUsername}/>
                  <Input type="Email" label="Email" value={SubEmail} setValue={setSubEmail}/>
                  <Input type="password" label="Password" value={Password} setValue={setPassword}/>
                  <button className={style.submit} onClick={handlesubmit} > 
                     { !loading? "login As Sub-Admin" : "please wait..." }
                    </button>
                   {Error && <p style={{color:"red", justifySelf:"center"}}>{Error}</p>}
                   {Success && <p style={{color:"gree", justifySelf:"center"}}>{Success}</p>} 
                </form>)}

          </div>
        </div>
    )
  }

export default Login;