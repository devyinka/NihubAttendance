import { SuccessCard } from "./SucessAndErrorCard";
import { ErrorCard } from "./SucessAndErrorCard";
import Image from "next/image";
import BarcodeDetectorScanner from "./BarcodeDetectorScanner";
import Html5QrcodeScanner from "./Html5QrcodeScanner";

const ActiveScannerScreen = ({
  message,
  error,
  loading,
  studentInfo,
  onClear,
  scannerMode,
  onScannerModeChange,
  onScan,
  scannerError,
  onScannerError,
}) => (
  <div className="mt-40 flex items-center justify-center">
    <div>
      <div className="rounded-lg bg-white shadow-lg  w-70 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center rounded-full bg-[#7741c3] h-10 w-10 mt-2">
          <Image src="/scanner.svg" width={20} height={20} alt="scanner icon" />
        </div>
        <h2 className="text-[#7741c3] text-center font-bold text-0.5xl mt-2 font-family: Arial">
          Scan Student Code
        </h2>
        <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2">
          Position the code within the frame to mark attendance
        </h2>
        <div className="mb-3 flex items-center gap-2 rounded-full bg-gray-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => onScannerModeChange("native")}
            className={`rounded-full px-3 py-1 transition ${
              scannerMode === "native"
                ? "bg-[#7741c3] text-white"
                : "text-gray-600"
            }`}
          >
            Built-in detector
          </button>
          <button
            type="button"
            onClick={() => onScannerModeChange("legacy")}
            className={`rounded-full px-3 py-1 transition ${
              scannerMode === "legacy"
                ? "bg-[#7741c3] text-white"
                : "text-gray-600"
            }`}
          >
            Legacy scanner
          </button>
        </div>
        {scannerError ? (
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
            {scannerError}
          </div>
        ) : null}
        <div className="w-50 max-60 bg-gray-200  rounded-lg   items-center justify-center mb-4">
          <div style={{ position: "relative", width: "100%" }}>
            {!message && !error ? (
              scannerMode === "native" ? (
                <BarcodeDetectorScanner
                  active={true}
                  onScan={onScan}
                  onError={onScannerError}
                />
              ) : (
                <Html5QrcodeScanner
                  active={true}
                  onScan={onScan}
                  onError={onScannerError}
                />
              )
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
