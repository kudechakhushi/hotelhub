import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomNumber from "@/app/model/roomnumber";

export async function GET(req, context) {
    
    // req → request object
    // context → contains route params
  await dbConnect();

  try {
    const { id } = await context?.params;
    // Extracting id from route params.
    // Splits the string wherever & appears. 
    // .map() runs a function on each item of that array.
    const [roomId, roomType] = id.split("&").map((param) => {
        // This splits again, now by =.
        // Result: ["roomId", "123"]
        //so key = "roomId"value = "123"
      const [key, value] = param.split("=");
      return value;
    //   You are ignoring the key completely and only keeping values.
    });

    console.log("parsed parameters", { roomId, roomType });

    if (!roomId || !roomType) {
      return NextResponse.json(
        {
          error: "missing required parameters",
        },
        { status: 400 }
      );
    }
// "Give me all room documents where:room_id = 123 roomtype_id = 456"
    const availablrRooms = await RoomNumber.find({
        // Querying MongoDB collection.
      room_id: roomId,
      roomtype_id: roomType,
    //   Filtering rooms by:room_id roomtype_id
    });

    return NextResponse.json(availablrRooms);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Request comes from frontend

// Frontend sends something like:

// /api/.../roomId=123&roomType=456

// 👉 Meaning:

// I want rooms of:
// roomId = 123
// roomType = 456
// 🟢 2. Server receives request
// API GET() function runs
// Database connection is established
// 🟢 3. Extract parameters

// From this string:

// "roomId=123&roomType=456"

// 👉 You extract:

// roomId = 123
// roomType = 456
// 🟢 4. Validate input

// 👉 If either is missing:

// Stop everything
// Return error
// 🟢 5. Query database

// 👉 Ask MongoDB:

// “Give me all rooms where:

// room_id = 123
// roomtype_id = 456”
// 🟢 6. Get matching rooms

// Example result:

// [
//   { room_no: "101", status: 1 },
//   { room_no: "102", status: 0 }
// ]

// 👉 These are actual room numbers

// 🟢 7. Send response to frontend

// Frontend receives room list and can:

// show available rooms
// allow selection
// assign room