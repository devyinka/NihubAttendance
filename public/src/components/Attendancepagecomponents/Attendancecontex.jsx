"use client"
import React, {useState } from "react";
import { createContext } from "react";


export const Attendancecontex=createContext()

export const  Attendancecontexprovider=({children})=>{

    const [studentinfo, setstudentinfo]=useState([])
    const [error, seterror]=useState();
    const [selectedeventid, setselectedeventid]=useState()
    const [selectedtrackid, setselectedtrackid]=useState("")

return(
    <Attendancecontex.Provider value=
    {{ studentinfo, setstudentinfo, error, seterror, 
         selectedeventid, setselectedeventid,
       selectedtrackid, setselectedtrackid 
    }}>
        {children}
    </Attendancecontex.Provider>
)
}