import style from "./scannercontainer.module.css";
import Image from "next/image";
const InitialScannerScreen = ({ onStart }) => (
  <div className={style.scannercontainer}>
    <div className={style.smallbox}>
      <Image src="/scanner.svg" width={20} height={20} alt="scanner icon" />
    </div>

    <h2 className={style.text}>Scan Student QR Code</h2>

    <h2 className={style.textsubtitle}>
      Position the QR code within the frame to mark attendance
    </h2>

    <div className={style.scannerframe}>
      <Image
        src="/qrcodescanner.svg"
        width={80}
        height={80}
        alt="scanner"
        style={{ justifySelf: "center" }}
      />
      <h2 className={style.qrcodesubtitle}>Click below to start scanning</h2>
    </div>

    <div className={style.simulatescanner}>
      <button className={style.simulate} onClick={onStart}>
        Mark Attendance
      </button>
    </div>
  </div>
);

export default InitialScannerScreen;
