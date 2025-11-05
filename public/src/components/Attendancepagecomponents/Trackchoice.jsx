import data from "../AddEventPageComponents/backendresponsemock"
import style from "./trackchoice.module.css"
import { useState,useEffect } from "react"
import axios from "axios"
import { useContext } from "react"
import { Attendancecontex } from "./Attendancecontex"


const Trackchoice=({label, value, setValue})=>{

const {selectedeventid, setselectedeventid,
      selectedtrackid, setselectedtrackid,
      seterror, setstudentinfo}=useContext(Attendancecontex)

const [events, setevents]=useState([]);  // it will be use to replace the mock data
const [trackvalue, settrackvalue]=useState("")
const [tracks, settracks]=useState([]);//it will be use to get value of track to replace mock

useEffect(()=>{ 

const fetchOptions=async()=>{
try{
  const Response=await axios.get(/*`${ApI}/event/${id}`*/)   // this will use programid to fetch event
  const data=await Response.json()
  setevents(data)  
 }catch(error){
  seterror("unable to fetch event",error)
 }
  }
 fetchOptions()
}, [])

//on click all the availabe tracks for this will be display
const handleeventclick= async (eventid)=>{

setValue(eventid)
setselectedeventid(eventid)

try{
  axios.get(`${API}event/${selectedeventid}/tracks`)
 .then(response=>{
     settracks(response.data)//   this is what  later use once the backend is ready
 })
}catch{(error) => {
    seterror("fail to fetch  track", error)
 } }
}

 const handletrackselected=async (trackid)=>{

     settrackvalue(trackid)   
     setselectedtrackid(trackid)
    try{
      if(selectedtrackid){
         const student=await axios.get(`${API}studentinfo/${selectedeventid}/${selectedtrackid}`)
         const response=await student.data
         setstudentinfo(response)}
         else{
         const student=await axios.get(`${API}studentinfo/${selectedeventid}`)
         const response=await student.data
         setstudentinfo(response)
         }

    }catch(error){
     seterror("unable to find student record" , error)
    }
}
    


const ResponseMock=data.find((data)=>data.id==selectedeventid) // once the API is integrate with this i will remve this 
return(
      <div className={style.container}>
        <label className={style.title}>{label}</label>
        <div className={style.inputsubtitle}> 
        <select  className={style.selected} value={value} onChange={(event)=>handleeventclick(event.target.value)} >
        <option value="">All events </option>
         {data.map((option)=>(//this data will be replace to use event state later
           <option className={style.title} key={option.id} value={option.id}>
              {option.name}
          </option>
                ))}
         </select>  
        
        {selectedeventid &&
         <select value={trackvalue} onChange={(event)=>handletrackselected(event.target.value)} className={style.selected2}>
                  <option value="">select track </option>
                  {ResponseMock.Tracks.map((option)=>//this ResponseMock .track will later use tracks directly from backend
                  <option key={option.id} value={option.id}> {option.fullname}</option>
                )}
         </select>}
            </div>      
        </div>
)

}

export default Trackchoice;

