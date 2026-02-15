import { useContext } from "react";
import { Attendancecontex } from "./Attendancecontex";

const Attendanceinfo = ({ search }) => {
  const { studentinfo } = useContext(Attendancecontex);

  const filterstudents = studentinfo.filter((student) =>
    student.student_matricnumber.includes(search),
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {filterstudents.map((info) => (
        <div
          key={info.student_matricnumber}
          className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4 items-center"
        >
          {/* Student Photo Circle - Left Side */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7741C3]  to-purple-600 flex items-center justify-center overflow-hidden border-3 border-purple-600 flex-shrink-0">
              {info.student_imageurl ? (
                <img
                  src={info.student_imageurl}
                  alt={info.student_matricnumber}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {(info.student_name || info.student_matricnumber)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Card Content - Right Side */}
          <div className="flex-1 min-w-0">
            {/* Matric Number */}
            <h3 className="font-bold text-[#7741C3] mb-2 text-base">
              {info.student_matricnumber}
            </h3>

            {/* Info Grid - 2x2 on mobile, 4 in a row on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {/* Event */}
              <div>
                <p className="text-gray-600 font-semibold uppercase text-xs">
                  Event
                </p>
                <p className="text-gray-800 font-medium truncate">
                  {info.eventname}
                </p>
              </div>

              {/* Track */}
              <div>
                <p className="text-gray-600 font-semibold uppercase text-xs">
                  Track
                </p>
                <p className="text-gray-800 font-medium truncate">
                  {info.trackname}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-2 md:col-span-1">
                <p className="text-gray-600 font-semibold uppercase text-xs">
                  Status
                </p>
                <span
                  className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold text-white mt-1 ${
                    info.student_attendance_status === "present"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {info.student_attendance_status === "present"
                    ? "✓ Present"
                    : "✗ Absent"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Attendanceinfo;
