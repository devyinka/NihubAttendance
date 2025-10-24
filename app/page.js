"use client"
import React from "react"
import { useState, useEffect } from "react"  
import Image from "next/image"
import EventRegistration from "@/public/src/components/landingpagecomponent/Card.component"
import data from "@/public/src/components/landingpagecomponent/backendresponsemock"
import style from "./page.module.css"
import Header from "@/public/src/components/landingpagecomponent/header"

export default function Home() {
  const [events, setEvents] = useState([])

  // useEffect(() => {  
  //   // Simulate fetching data from an API
  //   const fetchEvents = async () => {
  //        await fetch('https://your-backend-api.com/events')
  //       .then((response) => response.json())
  //       .then((data) => setEvents(data))
  //       .catch((error) => console.error('Error fetching events:', error));
  //   }     
  //     setEvents(data)
  //   }, [events]);


  return (
  <div style={{backgroundColor:"white"}}>
  <div className={style.container}>
  <Header info="Admin"/>
  <div className={style.background}>
   <Image src="/image.png" alt="" width={1336} height={600} className={style.image}/>
  </div>
  </div>
  <div className={style.availableevent}>
    <h1 className={style.textheading}>Available Events</h1>
    <h3 className={style.subheading}>Browse and register for upcoming events </h3>
  </div >
  <div className={style.eventcontainer}>
  <EventRegistration data={data}/>
  </div>
  </div>
  )}

    // <EventRegistration data={data}/>