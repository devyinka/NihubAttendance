import Image from "next/image";
const InitialScannerScreen = ({ onStart }) => (
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
