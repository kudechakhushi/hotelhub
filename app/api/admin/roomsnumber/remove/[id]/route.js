import dbConnect from "@/utils/dbConnect";

import BookingRoomList from "@/app/model/bookingroomlist";

import RoomNumber from "@/app/model/roomnumber";

import { NextResponse } from "next/server";
// Used to send response back to frontend
export async function DELETE(req, context) {
  await dbConnect();

  try {
    const { id } = await context?.params;
    // Extracts id from URL
    const params = new URLSearchParams(id);
    // Converts string into readable params
//     Extract values:
// Without URLSearchParams (Manual parsing)
// variable	meaning
// bookingId	which booking
// roomsId	which room type
// roomNumberId	which exact room
    const bookingId = params.get("bookingId");

    const roomsId = params.get("roomsId");

    const roomNumberId = params.get("roomNumber");

    if (!bookingId || !roomsId || !roomNumberId) {
      return NextResponse.json(
        {
          message: "missing require parameter",
        },
        { status: 400 }
      );
    }

    const deletedBookingRoom = await BookingRoomList.findOneAndDelete({
      booking_id: bookingId,
      room_id: roomsId,
    });
//     This is the main delete operation It removes the record from mapping table
// So:
// BookingRoomList
// DELETE where booking_id=123 AND room_id=456

    let updatedRoom = null;

    if (deletedBookingRoom?.room_number_id) {
        // Check if deleted record had a room reference
//         Now you update the room status
//          Meaning:
// Room is now AVAILABLE again
// status	meaning
// 0	booked
// 1	available
      updatedRoom = await RoomNumber.findByIdAndUpdate(
        deletedBookingRoom?.room_number_id,
        {
          status: 1,
        },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "room status updated and  booking  entry deleted",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "server  error",
      },
      { status: 500 }
    );
  }
}

// Request comes in

// Frontend sends DELETE request like:

// bookingId=123&roomsId=456&roomNumber=789
// Step 2: Extract parameters

// 👉 Parse values using URLSearchParams

// Step 3: Validate input

// 👉 If anything missing → reject request

// Step 4: Delete mapping

// 👉 Remove entry from BookingRoomList

// This means:
// 👉 “This room is no longer part of this booking”

// Step 5: Free the room

// 👉 Update RoomNumber.status = 1

// This means:
// 👉 “Room is now available again”

// Step 6: Send success response