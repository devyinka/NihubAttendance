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
  onScan,
  scannerError,
  onScannerError,
  onNativeFallback,
}) => (
  <div className="mt-40 flex items-center justify-center">
    <div>
      <div className="rounded-lg bg-white shadow-lg w-[320px] flex flex-col items-center justify-center overflow-hidden">
        <div className="flex items-center justify-center rounded-full bg-[#7741c3] h-10 w-10 mt-2">
          <Image src="/scanner.svg" width={20} height={20} alt="scanner icon" />
        </div>
        <h2 className="text-[#7741c3] text-center font-bold text-0.5xl mt-2 font-family: Arial">
          Scan Student Code
        </h2>
        <h2 className="text-gray-700 text-center font-normal text-sm mt-2 font-family: Arial mb-2">
          Position the code within the frame to mark attendance
        </h2>
        {scannerError ? (
          <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
            {scannerError}
          </div>
        ) : null}
        <div className="mb-4 w-full px-3">
          <div className="relative h-[380px] w-full overflow-hidden rounded-lg bg-gray-200">
            {!message && !error ? (
              scannerMode === "native" ? (
                <BarcodeDetectorScanner
                  active={true}
                  onScan={onScan}
                  onError={onScannerError}
                  onFallbackToLegacy={onNativeFallback}
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
      <div className="bg-[#7741c3] w-[320px] text-center rounded-md mt-4">
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
