import { NextResponse } from "next/server";
// Used to send responses back from your API.
import dbConnect from "@/utils/dbConnect";

import Booking from "@/app/model/booking";

import RoomBookedDate from "@/app/model/roomBookedDate";

import BookingRoomList from "@/app/model/bookingroomlist";

import { eachDayOfInterval, subDays } from "date-fns";
// eachDayOfInterval → gives all dates between check-in & check-out
// subDays → subtract days

export async function PUT(req, context) {
    await dbConnect();
    const { id } = await context.params;
    // Extract booking ID from URL
    try {
      const body = await req.json();
    //   Get data sent from frontend
      const booking = await Booking.findById(id);
    //   Fetch existing booking
      if (!booking) {
        return NextResponse.json(
          { success: false, error: "Booking not found" },
          { status: 404 }
        );
      }
    //   Only updates what frontend sends
      if (body.payment_status !== undefined) {
        booking.payment_status = body.payment_status;
      }
      if (body.status !== undefined) {
        booking.status = body.status;
      }
      if (body.name !== undefined) booking.name = body.name;
      if (body.email !== undefined) booking.email = body.email;
      if (body.phone !== undefined) booking.phone = body.phone;
      if (body.number_of_rooms !== undefined) {
        booking.number_of_rooms = body.number_of_rooms;
      }
  
      // Normalize dates for comparison
    //   Convert existing dates into:YYYY-MM-DD
    // If new date is sent → use it Otherwise → keep old
      const oldIn = new Date(booking.check_in).toISOString().slice(0, 10);
      const oldOut = new Date(booking.check_out).toISOString().slice(0, 10);
    //   Check if dates actually changed
//     If frontend sends a new check_in
// → convert it to "YYYY-MM-DD" format
// Else → keep old value
      const newIn = body.check_in
        ? new Date(body.check_in).toISOString().slice(0, 10)
        : oldIn;
      const newOut = body.check_out
        ? new Date(body.check_out).toISOString().slice(0, 10)
        : oldOut;
  
      const datesChanged = newIn !== oldIn || newOut !== oldOut;
    //   true	dates changed
    //   false	no change
    // dates changed → delete old booking footprint → rebuild new booking footprint
      if (datesChanged) {
        //   If dates changed → update booking
        // Convert back to Date objects
        const newCheckIn = new Date(newIn);
        const newCheckOut = new Date(newOut);
        const rooms_id = body.rooms_id?._id || body.rooms_id || booking.rooms_id;
        // Resolve room ID safely
        // Only access _id if body.rooms_id exists, otherwise don’t crash.”
        booking.check_in = newCheckIn;
        booking.check_out = newCheckOut;
        booking.rooms_id = rooms_id;
  
        // Only now clear assignments + dates
        // “Everything about this booking’s previous dates is now invalid”
        // Delete all room assignments
        await BookingRoomList.deleteMany({ booking_id: id });
        // Delete all booked dates
        await RoomBookedDate.deleteMany({ booking_id: id });
  
        // Fix: subDays(date, 1) — not subDays(newCheckOut - 1)
        const checkOutDateMinusOne = subDays(newCheckOut, 1);
        // Generate all dates
        const period = eachDayOfInterval({
          start: newCheckIn,
          end: checkOutDateMinusOne,
        });
  
        const newDates = period.map((date) => ({
          booking_id: booking._id,
          room_id: rooms_id,
          book_date: date,
        }));
        // Converts dates into DB records
  
        await RoomBookedDate.insertMany(newDates);
        // Save all dates in one go
      }
  
      await booking.save();
  
      return NextResponse.json({
        success: true,
        data: booking,
        message: "Booking Updated successfully",
      });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

//   Case: Dates NOT changed

//   👉 Nothing happens here
//   👉 No deletion
//   👉 Booking stays same
  
//   Case: Dates changed
  
//   👉 Step-by-step:
  
//   Detect change
//   Update booking dates
//   ❌ Delete all assigned rooms
//   ❌ Delete all booked dates
//   Generate new date range
//   Insert new booked dates