import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomType from "@/app/model/roomtype";
 import Room from "@/app/model/room";

export async function GET() {
  await dbConnect();

  try {
    const roomtype = await RoomType.find({});
    // Fetches all room types
    return NextResponse.json(roomtype);
    // Sends data as JSON
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
//   Converts incoming JSON request into JS object
  const { name } = body;
    // Extracts the name property from the request body
  console.log({ name });
  
  try {
    const roomtype = await RoomType.create({ name });
    // Inserts into RoomType collection
    console.log("roomtype", roomtype);

    const room = await Room.create({
      roomtype_id: roomtype?._id,
    //   This is the key relationship Room → linked to → RoomType
    });
    console.log("room", room);
    return NextResponse.json({
      roomtype,
      room,
    });
    // Returns both created objects
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}