// import { NextResponse } from "next/server";

// import dbConnect from "@/utils/dbConnect";

// import Room from "@/model/room";
// import RoomNumber from "@/model/roomnumber";
// import RoomBookedDate from "@/model/roomBookedDate";
// import BookingRoomList from "@/model/bookingroomlist";

// export async function GET(req, context) {
//   await dbConnect();

//   const { id } = await context.params;

//   const params = new URLSearchParams(id);
//   const check_in = params.get("checkIn");
//   const check_out = params.get("checkOut");
//   const guests = parseInt(params.get("guests") || "1");

//   try {
   
//     const sdate = new Date(check_in);
//     const edate = new Date(check_out);

//     const dt_array = [];
//     const current = new Date(sdate);
//     while (current < edate) {
//       dt_array.push(new Date(current).toISOString().split("T")[0]);
//       current.setDate(current.getDate() + 1);
//     }

    
//     const bookingDates = await RoomBookedDate.find({
//       book_date: { $in: dt_array },
//     }).distinct("booking_id");

//     // 2. Get all active rooms
//     const rooms = await Room.find({ status: 1 }).populate('roomtype_id');

//     const availableRooms = [];

//     // 3. Calculate availability for each room
//     for (const room of rooms) {
//       const roomNumbersCount = await RoomNumber.countDocuments({
//         room_id: room._id,
//         status: 1,
//       });

//       const bookedRooms = await BookingRoomList.find({
//         booking_id: { $in: bookingDates },
//         room_id: room._id,
//       });

//       const totalBooked = bookedRooms.length;
//       const availableRoom = roomNumbersCount - totalBooked;

   
//       if (availableRoom > 0 && guests <= parseInt(room?.total_adult)) {
//         availableRooms.push({
//           ...room.toObject(),
//           availableRoom,
//         });
//       }
//     }

//     console.log(" availableRoom ", availableRooms);

//     return NextResponse.json(availableRooms);


//   } catch (error) {
//     console.error("Room availability check error:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }



// this is for checking the availability of the room in dashboard of home page component
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Room from "@/app/model/room";
import RoomNumber from "@/app/model/roomnumber";
import RoomBookedDate from "@/app/model/roomBookedDate";
import BookingRoomList from "@/app/model/bookingroomlist";

export async function GET(req, context) {
    // req = request
// context.params = dynamic route params
  await dbConnect();
  console.log("✅ Database connected");

  const { id } = await context.params;
//   You’re using a dynamic route like:
// /api/homeroom/[id]
  console.log("🆔 Raw ID from params:", id);

  const params = new URLSearchParams(id);
//   Converts string → query parser
  const check_in = params.get("checkIn");
//   Reads the value of "checkIn" from the query string
  const check_out = params.get("checkOut");
  const guests = parseInt(params.get("guests") || "1");
//   params.get("guests")
// Returns "2" (string) else null than return 1

  console.log("📅 Check-in:", check_in, "Check-out:", check_out, "Guests:", guests);

  try {
    const sdate = new Date(check_in);
    const edate = new Date(check_out);
    // Convert string → Date objects
    const dt_array = [];
    const current = new Date(sdate);
    // current → pointer that moves day-by-day
    while (current < edate) {
        // Runs until current reaches check-out
      dt_array.push(new Date(current).toISOString().split("T")[0]);
//       new Date(current) → clone date
// .toISOString() → "2026-07-10T00:00:00.000Z"
// .split("T")[0] → "2026-07-10"
      current.setDate(current.getDate() + 1);
    //   Move to next day
    }

    console.log("📆 Date range for booking:", dt_array);
    // ["2026-07-10", "2026-07-11", "2026-07-12"]
    const bookingDates = await RoomBookedDate.find({
//         This queries your MongoDB collection RoomBookedDate
// You're searching for records where:
      book_date: { $in: dt_array },
//       $in: dt_array
// $in means:
// 👉 “Find documents where book_date matches any value inside dt_array”
    }).distinct("booking_id");
    // After finding matching documents, this:
    // 👉 extracts unique booking IDs only
    console.log("📌 Conflicting booking IDs:", bookingDates);

    const rooms = await Room.find({ status: 1 }).populate('roomtype_id');
    // Room.find({ status: 1 })
// Fetches all rooms where:
// .populate('roomtype_id')
// This replaces the roomtype_id reference with actual data
    console.log("🏨 Total active rooms fetched:", rooms.length);

    const availableRooms = [];

    for (const room of rooms) {
        // Loops through each room from the rooms array
      const roomNumbersCount = await RoomNumber.countDocuments({
        room_id: room._id,
        status: 1,
      });
    //   Counts how many physical rooms exist for this room type

      const bookedRooms = await BookingRoomList.find({
        booking_id: { $in: bookingDates },
        room_id: room._id,
      });
    //   Finds rooms that are already booked
//     booking_id: { $in: bookingDates }
// → only bookings that match selected dates
// room_id: room._id
// → only this specific room

      const totalBooked = bookedRooms.length;
    //   Gets how many rooms are booked/
      const availableRoom = roomNumbersCount - totalBooked;

      console.log(`➡️ Room: ${room.name || room._id}`);
      console.log("   ↪️ Total room numbers:", roomNumbersCount);
      console.log("   ↪️ Booked room numbers:", totalBooked);
      console.log("   ↪️ Available:", availableRoom);

      if (availableRoom > 0 && guests <= parseInt(room?.total_adult)) {
//         availableRoom > 0
// → room must have availability
// Condition 2:
// guests <= parseInt(room?.total_adult)
// → room can handle number of guests
        availableRooms.push({
            // Adds room to availableRooms
          ...room.toObject(),
          availableRoom,
//           room.toObject() → converts MongoDB object to plain JS object
// ... → spreads all room data
// availableRoom → adds new field
        });
      }
    }

    //console.log("✅ Final Available Rooms:", availableRooms.length);

    return NextResponse.json(availableRooms);
    // sends available rooms as API response
  } catch (error) {
   // console.error("❌ Room availability check error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Step 1: Frontend sends request
// /api/homeroom/checkIn=2026-07-10&checkOut=2026-07-13&guests=2
// Step 2: Backend receives it
// Extracts:
// checkIn, checkOut, guests
// Step 3: Generate date range
// ["10", "11", "12"]
// Step 4: Find bookings on those dates
// → booking IDs that clash
// Step 5: Get all active rooms
// Step 6: For each room
// Count total units
// Count booked units
// Calculate available
// Step 7: Filter
// Enough capacity?
// Has availability?
// Step 8: Return only valid rooms
// Step 9: Frontend displays them