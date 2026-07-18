
import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Homepage from "@/app/component/home/home";
import SnapBooking from "@/app/component/snapbooking/SnapBooking";
import Rooms from "@/app/component/rooms/Rooms";
import Team from "@/app/component/team/Team";
import Service from "@/app/component/service/Service";
import Faqsection from "@/app/component/Faqsection/Faqsection";
import Testimonial from "@/app/component/testimonial/Testimonial";
import Blogs from "@/app/component/blog/Blog";
export default function Home() {
  return(
    <div>
      <Homepage />
      <Rooms />
      {/* // call rooms component to show all the rooms in the home page */}
      <SnapBooking />
      <Team />
      <Testimonial />
      <Service />
      <Faqsection />
      <Blogs />
    </div>
  )
  
}
