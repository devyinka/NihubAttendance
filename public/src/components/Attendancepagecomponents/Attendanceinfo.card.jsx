import { useContext } from "react"
import style from "./Attendanceinfo.card.module.css"
import { Attendancecontex } from "./Attendancecontex"


const Attendanceinfo=({search})=>{
    
    const {studentinfo}=useContext(Attendancecontex)

    const filterstudents=studentinfo.filter(student=>
        student.matricnumber.includes(search)
    )

    return(
        <div>
            {filterstudents.map((info)=>(
                <div  key={info.id} >
                    <div  className={style.container}>
                    <span className={style.matric}>{info.matricnumber}</span>
                    <span className={style.event}>{info.eventname}</span>
                    <span className={style.event}>{info.Trackname}</span>
                    <span className={style.status}>{info.status}</span>
                    </div>
                    <hr className={style.hr}/>
                </div>
            ))}
        </div>
    )

}

export default Attendanceinfo


 