import dbConnect from "@/utils/dbConnect";

import Booking from "@/app/model/booking";

import BookingRoomList from "@/app/model/bookingroomlist";

import RoomNumber from "@/app/model/roomnumber";

import { NextResponse } from "next/server";
// Used to send API responses


export async function POST(req) {
  try {
    await dbConnect();

    const { bookingId, roomsId, roomNumber } = await req.json();
    // bookingId → which booking
    // roomsId → which room type/hotel
    // roomNumber → specific room (like Room 101)
    const booking = await Booking.findById(bookingId);
    // Fetch booking from DB
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 1) Don't assign more rooms than booked
    // Count how many rooms already assigned
    const assignedCount = await BookingRoomList.countDocuments({
      booking_id: bookingId,
    });
    // If user already got all rooms they booked
    if (assignedCount >= booking.number_of_rooms) {
      return NextResponse.json(
        { message: "All rooms already assigned for this booking" },
        { status: 400 }
      );
    }

    // 2) Find other bookings that use THIS room number
    // Find all bookings using this same room
    const existingAssignments = await BookingRoomList.find({
      room_number_id: roomNumber,
    }).populate({
        // Replace booking_id with actual booking data
      path: "booking_id",
      select: "user_id rooms_id check_in check_out",
    });

    const currentUserId = booking.user_id?.toString();
    // Get user ID safely
    const currentRoomId = (roomsId || booking.rooms_id)?.toString();
//     Use:
// new roomId (if provided)
// else old booking roomId/
    const currentIn = new Date(booking.check_in).toISOString().slice(0, 10);
    const currentOut = new Date(booking.check_out).toISOString().slice(0, 10);
    // Convert dates to YYYY-MM-DD  
    const conflict = existingAssignments.find((row) => {
        // Loop through all assignments of this room
      const other = row.booking_id;
    //   Get the booking data linked to this room assignment
      if (!other) return false;

      // skip same booking (re-assign / edge case)
      if (other._id.toString() === bookingId) return false;
    //   Ignore same booking
      const sameUser = other.user_id?.toString() === currentUserId;
    //   Check: is it the same user?
      const sameHotel = other.rooms_id?.toString() === currentRoomId;
    //   Convert other booking dates → YYYY-MM-DD
      const otherIn = new Date(other.check_in).toISOString().slice(0, 10);
      const otherOut = new Date(other.check_out).toISOString().slice(0, 10);

      // exact same dates (as you asked)
      const sameDates = otherIn === currentIn && otherOut === currentOut;
    //   Check: dates are exactly same
      // OR use overlap (stronger - recommended):
      // const overlap = otherIn < currentOut && otherOut > currentIn;

      return sameUser && sameHotel && sameDates;
    });

    if (conflict) {
      return NextResponse.json(
        {
          message:
            "This room is already assigned to this user for the same dates at this hotel",
        },
        { status: 400 }
      );
    }

    // 3) Save assignment
//     Create new record:

// which booking
// which room type
// which room number
    await new BookingRoomList({
      booking_id: bookingId,
      room_id: roomsId,
      room_number_id: roomNumber,
    }).save();

    // Mark room as occupied

    // 0 = not available
    // 1 = available (based on your system)
    await RoomNumber.findByIdAndUpdate(roomNumber, {
      $set: { status: 0 },
    });

    return NextResponse.json({ message: "room assigned successfully" });
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

// Request comes from frontend

// User selects room → sends:

// bookingId
// roomsId
// roomNumber
// 2. Connect DB
// 3. Fetch booking
// If not found → stop
// 4. Check limit
// If already assigned enough rooms → stop
// 5. Get all assignments of that room
// 6. Check conflict
// Same user
// Same hotel
// Same dates

// 👉 If yes → reject

// 7. Save new assignment
// 8. Mark room as occupied
// 9. Send success response