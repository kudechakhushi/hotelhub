// this for all room in home page component app/component/rooms/Rooms.js
import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Room from "@/app/model/room";
import RoomType from "@/app/model/roomtype";

export async function GET() {
  await dbConnect();

  try {
    const rooms = await Room.find({})
    // Fetches ALL documents from Room collection
    // .populate() is used to populate the roomtype_id field with the roomtype name 
    // wthout this u get id not data
      .populate({
        path: "roomtype_id",
        model: RoomType,
        select: "name",
      })

      .lean();
    //   Converts Mongoose documents → plain JavaScript objects

 //console.log(" rooms", rooms)


    return NextResponse.json(rooms);
    // Sends data as JSON response
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}