import dbConnect from "@/utils/dbConnect";

import Booking from "@/app/model/booking";

import BookingRoomList from "@/app/model/bookingroomlist";

import { NextResponse } from "next/server";
// Used to send HTTP responses in Next.js API routes
export async function GET(req, context) {
    // req → incoming request
// context → contains route params
  const { id } = await context.params;
//   Extract id from URL
 console.log("id" , id)



  try {
    await dbConnect();

    const booking = await Booking.findById(id);
    // Find booking by ID
    if (!booking) {
      return NextResponse.json(
        {
          message: "Booking not found",
        },
        { status: 404 }
      );
    }
    // Give me all room records where booking_id = this id”
    const roomList = await BookingRoomList.find({ booking_id: id }).populate(
      "room_number_id"
    );
    // it replaces it with actual room data:
    console.log("roomlist", roomList);
    return NextResponse.json(roomList);
    // Send room list as response
  } catch (error) {
    return NextResponse.json(
      {
        message: "server error",
        alertType: "error",
      },
      { status: 500 }
    );
  }
}

// ample:

// /api/.../booking/123

// 👉 id = 123

// 2. Connect to database
// await dbConnect();

// 👉 Without DB connection → everything fails
// (Simple but critical step)

// 3. Find the booking
// Booking.findById(id)

// 👉 Reality check:

// If booking doesn’t exist → stop immediately
// No booking = no rooms = useless request
// 4. If booking NOT found → return error
// 404 Booking not found

// 👉 This prevents:

// invalid frontend calls
// broken UI states
// 5. Fetch all rooms linked to that booking
// BookingRoomList.find({ booking_id: id })

// 👉 This is the important relationship layer

// Your DB structure is like:

// Booking (main)
//    ↓
// BookingRoomList (mapping table)
//    ↓
// RoomNumber (actual room)

// So this step means:

// 👉 “Give me all rows where booking_id = 123”

// 6. Populate room details
// .populate("room_number_id")

// 👉 Without populate:

// room_number_id: "64hshshs123"

// 👉 With populate:

// room_number_id: {
//   room_no: 101,
//   status: 0
// }

// 👉 So now frontend gets real data, not useless IDs

// 7. Send response to frontend
// return roomList;

// 👉 Final output = list of booked rooms + their details