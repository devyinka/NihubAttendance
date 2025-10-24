"use client"
import Image from "next/image"
import style from "./header.module.css"

const Header=()=>{

return(
     <div className={style.Header}>
       <div className={style.logo}>
          <Image src="/logo.png" alt="" width={20} height={20} style={{background:"rgba(159, 118, 216, 80)"}}/>
          <h6 className={style.logofont}>NIHUB Events </h6>
       </div>
  </div>)
   
}

export default Header