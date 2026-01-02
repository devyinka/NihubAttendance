import Image from "next/image";
import style from "./scannercontainer.module.css";
export const SuccessCard = ({ studentInfo }) => (
  <div className={style.failscan}>
    {
      <Image
        src={
          studentInfo.student_imageurl
            ? studentInfo.student_imageurl
            : "/mark.svg"
        }
        alt="mark"
        width={200}
        height={200}
      />
    }
    <h1 className={style.qrcodesubtitle}>
      {studentInfo.alreadyMarked ? "Already Marked" : "Attended"}
    </h1>
    <h2 className={style.qrcodesubtitle}>{studentInfo.student_name}</h2>
    <h2 className={style.qrcodesubtitle}>{studentInfo.student_matricnumber}</h2>

    {studentInfo.alreadyMarked && studentInfo.markedAt && (
      <h3 className={style.qrcodesubtitle}>
        Marked at: {new Date(studentInfo.markedAt).toLocaleTimeString()}
      </h3>
    )}
  </div>
);

export const ErrorCard = ({ error }) => (
  <div className={style.failscan}>
    <Image src="/fail.svg" alt="fail" width={80} height={80} />
    <h1 className={style.qrcodesubtitle}>
      {error === "Student not found" ? "Student Not Found" : "Invalid Track"}
    </h1>

    <h2 className={style.qrcodesubtitle}>
      {error === "Student not found"
        ? "This student is not registered for this event"
        : "This track is not valid for the selected event"}
    </h2>
  </div>
);
