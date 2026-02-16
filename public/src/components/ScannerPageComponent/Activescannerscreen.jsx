import { SuccessCard } from "./SucessAndErrorCard";
import { ErrorCard } from "./SucessAndErrorCard";
import Image from "next/image";
const ActiveScannerScreen = ({
  message,
  error,
  loading,
  studentInfo,
  onClear,
}) => (
  <div className="mt-40 flex items-center justify-center">
    <div>
      <div className="rounded-lg bg-white shadow-lg  w-70 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center rounded-full bg-[#7741c3] h-10 w-10 mt-2">
          <Image src="/scanner.svg" width={20} height={20} alt="scanner icon" />
        </div>
        <h2 className="text-[#7741c3] text-center font-bold text-0.5xl mt-2 font-family: Arial">
          Scan Student QR Code
        </h2>
        <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2">
          Position the QR code within the frame to mark attendance
        </h2>
        <div className="w-45 max-h-70 bg-gray-200 mb-0 rounded-lg   items-center justify-center">
          <div style={{ position: "relative", width: "100%" }}>
            {!message && !error ? (
              <div id="qr-reader" style={{ width: "100%" }} />
            ) : null}
            {message && !error && <SuccessCard studentInfo={studentInfo} />}
            {error && <ErrorCard error={error} />}
          </div>
        </div>
      </div>
      <div className="bg-[#7741c3] w-70 text-center rounded-md mt-4">
        <button
          className="text-white font-bold py-2 px-4 rounded-md text-sm"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  </div>
);

export default ActiveScannerScreen;
