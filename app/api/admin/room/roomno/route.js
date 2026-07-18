import { NextResponse } from "next/server";
// Used to send API responses (like res.json() in Express)
import dbConnect from "@/utils/dbConnect";
import RoomNumber from "@/app/model/roomnumber";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
//   Reads JSON sent from frontend
  try {
    const { status, roomNumber, room_id, roomtype_id } = body;
    //   Extract values from request body
    const roomNumberData = {
      room_id: room_id,
      roomtype_id: roomtype_id,
      room_no: roomNumber,
      status: 1,
    };
    // Creating object to insert into DB

    await RoomNumber.create(roomNumberData);
    //   Inserts new document into MongoDB
    return NextResponse.json({ success: "successfully updated" });
    //   Sends success response to frontend
  } catch (error) {
    //   Sends error response to frontend
    return NextResponse.json({ error: error.message }, { status: 500 });
    //   500 (Internal Server Error)
    // 👉 Something broke in backend
  }
}