"use client"
import Image from "next/image"
import style from "./Card.module.css"
import Link from "next/link"
const EventRegistration=({data})=>{

    return(
        data.filter(programinfo => programinfo.status).map((programinfo)=>(
        <div key={programinfo.id} className={style.cardSize}>
            <Image src={programinfo.imageurl} alt="image" height={100} width={236}/>
            <h2 className={style.eventname}>{programinfo.name}</h2>
                <div className={style.describe}>
                  <h5>{programinfo.programDescription}</h5>
                </div>
              <div className={style.container}>
                <Image src="/calender.svg" alt="" height={10} width={10}/> 
                <h4 className={style.subtitle}>{programinfo.date}</h4>
              </div>
              <div className={style.container}>
                <Image src="/location.svg" alt="" height={10} width={10}/>
                <h4 className={style.subtitle}>{programinfo.location}</h4>
              </div>
               <div className={style.container}>
                <Image src="/people.svg" alt="" height={10} width={10}/>
                <h4 className={style.subtitle}>{programinfo.Register}</h4>
              </div>
              <div className={style.button}>
              <Link href={`./Registration?Programid=${programinfo.id}`}>Register for the event</Link>
            </div>
        </div>
       
        )   
    )
    )
}
export default EventRegistration