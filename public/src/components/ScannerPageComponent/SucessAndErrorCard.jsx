import Image from "next/image";
import style from "./scannercontainer.module.css";
export const SuccessCard = ({ studentInfo }) => (
  <div className="flex flex-col items-center justify-center">
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
    <h1 className="text-[#7741c3] text-center font-bold text-0.5xl mt-2 font-family: Arial">
      {studentInfo.alreadyMarked ? "Already Marked" : "Attended"}
    </h1>
    <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2">
      {studentInfo.student_name}
    </h2>
    <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2">
      {studentInfo.student_matricnumber}
    </h2>

    {studentInfo.alreadyMarked && studentInfo.markedAt && (
      <h3 className="text-gray-700 text-center font-normal text-xs mt-2 font-family: Arial">
        Marked at: {new Date(studentInfo.markedAt).toLocaleTimeString()}
      </h3>
    )}
  </div>
);

export const ErrorCard = ({ error }) => (
  <div className="flex flex-col items-center justify-center">
    <Image src="/fail.svg" alt="fail" width={80} height={80} />
    <h1 className="text-[#7741c3] text-center font-bold text-0.5xl mt-2 font-family: Arial">
      {error === "Student not found" ? "Student Not Found" : "Invalid Track"}
    </h1>

    <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2 px-4">
      {error === "Student not found"
        ? "This student is not registered for this event"
        : "This track is not valid for the selected event"}
    </h2>
  </div>
);
