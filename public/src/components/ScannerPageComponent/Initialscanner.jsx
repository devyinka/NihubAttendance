import style from "./scannercontainer.module.css";
import Image from "next/image";
const InitialScannerScreen = ({ onStart }) => (
  //    {
  //   border-radius: 16px;
  //   background: #fff;
  //   box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  //   margin-left: 30%;
  //   margin-right: 30%;
  //   margin-top: 5%;
  //   padding-top: 2%;
  //   padding-bottom: 2%;
  //   margin-bottom: 3%;
  //   width: 30%;
  //   align-self: center;
  //   justify-self: center;
  // }

  <div className="min-h-screen flex items-center justify-center">
    <div>
      <div className="rounded-lg bg-white shadow-lg  w-70 flex flex-col items-center">
        <div className="flex items-center justify-center rounded-full bg-[#7741c3] h-10 w-10 mt-2">
          <Image src="/scanner.svg" width={20} height={20} alt="scanner icon" />
        </div>
        <h2 className="text-[#7741c3] text-center font-bold text-0.5xl mt-2 font-family: Arial">
          Scan Student QR Code
        </h2>
        <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2">
          Position the QR code within the frame to mark attendance
        </h2>
        {/* width: 70%; max-height: 70%; justify-self: center; background-color:
      #f3f3f3; margin-bottom: 2%; border-radius: 16px; padding: 1%; */}
        <div className="w-50 max-h-70 bg-gray-200 mb-4 rounded-lg p-1  items-center justify-center">
          <Image
            src="/qrcodescanner.svg"
            width={80}
            height={80}
            alt="scanner"
            style={{ justifySelf: "center" }}
          />

          <h2 className="text-[#7741c3] text-center font-normal text-sm mt-2 font-family: Arial pl-2 pr-2">
            Click below to start scanning
          </h2>
        </div>
      </div>
      <div className="bg-[#7741c3] w-70 text-center rounded-md mt-4">
        <button
          className="text-white font-bold py-2 px-4 rounded-md text-sm"
          onClick={onStart}
        >
          Mark Attendance
        </button>
      </div>
    </div>
  </div>
);

export default InitialScannerScreen;
