// Taking raw booking data → calculating availability → sending enriched data
//  → frontend shows it in a table
import { NextResponse } from "next/server";
// Used to send response from Next.js API route
import dbConnect from "@/utils/dbConnect";

import Room from "@/app/model/room";
import RoomType from "@/app/model/roomtype";

import RoomNumber from "@/app/model/roomnumber";

import Booking from "@/app/model/booking";

import BookingRoomList from "@/app/model/bookingroomlist";

import RoomBookedDate from "@/app/model/roomBookedDate";

export async function GET() {
  await dbConnect();

  try {
    // Fetch bookings and populate single room + roomtype
    // Booking.find({})
// Fetch ALL bookings from DB
// .populate(...)
// Replace IDs with actual data
    const bookings = await Booking.find({}).populate({
      path: "rooms_id",
    //   Replace rooms_id with actual Room document
      populate: {
        path: "roomtype_id",
        model: "RoomType",
        // Inside room → replace roomtype_id with RoomType
      },
    });

    const enrichedBookings = [];
// You’ll store modified bookings here
    for (const booking of bookings) {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
    //   Convert DB date → JS Date object
      // Generate date array
      const dt_array = [];
      for (
        let d = new Date(checkIn);
        d <= checkOut;
        d.setDate(d.getDate() + 1)
//         tart from check-in date
// Run until check-out
// Increase by 1 day each loop
      ) {
        dt_array.push(new Date(d).toISOString().split("T")[0]);
//         toISOString() → "2026-07-14T00:00:00.000Z"
// .split("T")[0] → "2026-07-14"
//  You store only date part
      }

      // Get all booking IDs made during these dates
      const bookingIds = await RoomBookedDate.find({
        book_date: { $in: dt_array },
        // $in = “match any value inside this array”
        // Give me all records where booking exists on ANY of these dates”
      }).distinct("booking_id");
    //   You extract only unique booking IDs
      const room = booking.rooms_id;
    //   You take the room linked to current booking
      // Defensive check if room exists
      if (!room) {
        enrichedBookings.push({
          ...booking.toObject(),
        //   ...booking.toObject()
// Spread all booking fields into a new object
          availableRooms: 0,
        //   Adds a new field
        // This booking has no valid room → assume 0 availability”
        });
        continue;
        // Skip the rest of this loop and go to the next booking
      }

      // Count total active room numbers
      const totalRoomNumbers = await RoomNumber.countDocuments({
        // RoomNumber.countDocuments({...})
// MongoDB function to count matching records
        room_id: room._id,
        // “Only count room numbers belonging to THIS room”
        status: 1,
        // Only count active room numbers (status = 1)
      });

      // Count booked ones
      const bookedCount = await BookingRoomList.countDocuments({
        // Counts how many rooms are already booked in that date range
        booking_id: { $in: bookingIds },
//         bookingIds = all bookings overlapping those dates
// $in = match any of them
//  Meaning:
// “only consider bookings happening on those dates”
        room_id: room._id,
        // Only count bookings for THIS room”
      });

      const availableRoomCount = totalRoomNumbers - bookedCount;

      enrichedBookings.push({
        ...booking.toObject(),
// Copy all booking data
        availableRooms: availableRoomCount,
        
// Add calculated field
      });
    }

    return NextResponse.json(enrichedBookings);
    // Sends the final result to frontend
  } catch (err) {
    console.error(" Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// Frontend → API call

// API:
//   1. Fetch bookings
//   2. For each booking:
//       - Get date range
//       - Find overlapping bookings
//       - Count total rooms
//       - Count booked rooms
//       - Calculate available rooms
//       - Attach to booking
//   3. Return enriched data

// Frontend:
//   4. Store data in state
//   5. Map over data
//   6. Render table rows