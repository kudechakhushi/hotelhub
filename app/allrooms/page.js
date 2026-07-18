"use client";
import React, { Suspense } from 'react';
import Rooms from "@/app/component/room/Rooms";

export default function Roomss() {
  return (
 <Suspense fallback={<div>Loading rooms...</div>}>
        <Rooms/>
      </Suspense>
   
  )
}