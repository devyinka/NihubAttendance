import { SuccessCard } from "./SucessAndErrorCard";
import { ErrorCard } from "./SucessAndErrorCard";
import Image from "next/image";
import style from "./scannercontainer.module.css";
const ActiveScannerScreen = ({
  message,
  error,
  loading,
  studentInfo,
  onClear,
}) => (
  <div className={style.scannercontainer}>
    <div className={style.smallbox}>
      <Image src="/scanner.svg" width={20} height={20} alt="scanner icon" />
    </div>
    <h2 className={style.text}>Scan Student QR Code</h2>
    <h2 className={style.textsubtitle}>
      Position the QR code within the frame to mark attendance
    </h2>

    <div className={style.scannerframe}>
      <div style={{ position: "relative", width: "100%" }}>
        {!message && !error ? (
          <div id="qr-reader" style={{ width: "100%" }} />
        ) : null}
        {message && !error && <SuccessCard studentInfo={studentInfo} />}
        {error && <ErrorCard error={error} />}
      </div>
    </div>
    <div className={style.simulatescanner}>
      <button className={style.simulate} onClick={onClear}>
        Clear
      </button>
    </div>
  </div>
);

export default ActiveScannerScreen;
