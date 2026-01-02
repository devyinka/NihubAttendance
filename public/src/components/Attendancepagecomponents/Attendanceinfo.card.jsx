import { useContext } from "react";
import style from "./Attendanceinfo.card.module.css";
import { Attendancecontex } from "./Attendancecontex";

const Attendanceinfo = ({ search }) => {
  const { studentinfo } = useContext(Attendancecontex);

  const filterstudents = studentinfo.filter((student) =>
    student.student_matricnumber.includes(search)
  );

  return (
    <div>
      {filterstudents.map((info) => (
        <div key={info.student_matricnumber}>
          <div className={style.container}>
            <span className={style.matric}>{info.student_matricnumber}</span>
            <span className={style.event}>{info.eventname}</span>
            <span className={style.event}>{info.trackname}</span>
            <span className={style.status}>
              {info.student_attendance_status}
            </span>
          </div>
          <hr className={style.hr} />
        </div>
      ))}
    </div>
  );
};

export default Attendanceinfo;
