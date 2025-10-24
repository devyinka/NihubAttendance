"use client"
import useState from "react"
import { useEffect } from "react"
import style from "./Trackchoice.module.css"
import { data } from "./mockbackendresponsemock"

const Trackchoice=({label, value, setValue,BACKendURl,id})=>{
// const url = new URL(BACKendURl);
//   const programid = url.pathname.split('/').pop(); // uncomment all these codes after intgrate with backend

 // const [options, setoptions]=useState([])
            useEffect(()=>{ 
                const fetchOptions=async()=>{
                    try{
                        const Response=await fetch(`BACKURL/${programid}`)// this will use programid to fetch that particular document
                        const data=await Response.json()
                        setoptions(data)
                    }catch(error){
                        console.error("Error fetching options:", error)
                    }
                }
                fetchOptions()
            }, [BACKendURl])
  
const look=4
  const ResponseMock=data.find((data)=>data.id==look)//mock backend response to be replaced with actual backend response
   
            
    return(
        <div>
            <label className={style.title}>{label}</label>
            <div className={style.inputsubtitle}> 
            <select style={{border:"none", outline:"none"}} value={value} onChange={(event) => setValue(event.target.value)}>
                <option value="">Select {label}</option>
                {ResponseMock.Tracks.map((option)=>(
                    <option className={style.title} key={option.id} value={option.Abrevation}>
                        {option.fullname}
                    </option>
                ))}
            </select> 
            </div>
        </div>
    )

}

export default Trackchoice;