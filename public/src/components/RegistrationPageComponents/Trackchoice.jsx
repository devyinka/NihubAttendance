"use client"
import useState from "react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import style from "./Trackchoice.module.css"
import { data } from "./mockbackendresponsemock"

const Trackchoice=({label, value, setValue})=>{                                           
 // const [options, setoptions]=useState([])    // uncomment all this line after intgrate with backend

 const searchParams = useSearchParams();
  const id = searchParams.get('Programid')

            useEffect(()=>{ 
                const fetchOptions=async()=>{
                    try{
                        const Response=await fetch(`${ApI}/${id}`)   // this will use programid to fetch that particular track of that event
                        const data=await Response.json()
                        setoptions(data)
                    }catch(error){
                        console.error("Error fetching options:", error)
                    }
                }
                fetchOptions()
            }, [])
  
const look=id ||1 // i will later remove 1

  const ResponseMock=data.find((data)=>data.id==look) //mock backend response to be replaced with actual backend response
        
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