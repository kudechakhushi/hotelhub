// this is used in component/checkout/Checkout.js
import { NextResponse } from "next/server";
// Used to send responses from a Next.js API route
import dbConnect from "@/utils/dbConnect";
import Room from "@/app/model/room";
import { differenceInDays, parseISO } from "date-fns"; 
// Optional: use this for better date handling
// differenceInDays → calculates nights
// parseISO → imported but NOT used (sloppy)
import RoomType from "@/app/model/roomtype"; // Import the RoomType model

export async function POST(req, context) {
  await dbConnect();

  try {
    const body = await req.json();
    // Converts incoming JSON request into JS object
    const { checkIn, checkOut, roomId, rooms, guests } = body;
    // Extracts required booking data
    console.log("Parsed******** parameters:", {
      checkIn,
      checkOut,
      roomId,
      rooms,
      guests,
    });

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    // Converts strings → Date objects
    const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));
    // Calculates number of nights
    // If same day → 0 → forced to 1
    // Prevents zero-night bookings
    // Fetch the room details

    // Fetch room by ID
    // Populates roomtype_id field with RoomType data
    // Selects only the name field from RoomType
    const room = await Room.findById(roomId).populate({
      path: "roomtype_id",
      model: RoomType,
      select: "name", // Only select the name field from RoomType
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const pricePerNight = room.price;
    const discountPercent = room.discount || 0;

    const subtotal = pricePerNight * nights * rooms;
    // Total before discount
    const discountAmount = (subtotal * discountPercent) / 100;
    // Calculates discount
    const total = subtotal - discountAmount;
    // Final price
    const result = {
      pricePerNight,
      nights,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      rooms,
      guests,
      roomTypeName: room.roomtype_id.name,
      room_id: room?._id,
      checkIn,
      checkOut,
      image: room?.image,
    };

    console.log("calculate result ", result);

    return NextResponse.json(result);
    // Sends JSON back to frontend

  } catch (err) {
    console.log("Error fetching room details or calculating prices:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch room pricing" },
      { status: 500 }
    );
  }
}
// STEP 1: Frontend sends POST request
// POST /api/checkout

// With body:

// {
//   "checkIn": "2026-01-01",
//   "checkOut": "2026-01-05",
//   "roomId": "abc123",
//   "rooms": 2,
//   "guests": 4
// }
// 🟡 STEP 2: Server receives request
// POST() function runs
// Connects to DB
// 🟠 STEP 3: Extract input
// Dates
// Room ID
// Rooms count
// Guests
// 🔵 STEP 4: Calculate nights
// differenceInDays → 4 nights
// 🟣 STEP 5: Fetch room from DB
// Room.findById(roomId)
// 🟤 STEP 6: Populate room type
// room.roomtype_id.name → "Deluxe"
// ⚫ STEP 7: Calculate pricing

// Example:

// price = 100
// nights = 4
// rooms = 2
// subtotal = 100 * 4 * 2 = 800
// discount = 10% → 80
// total = 720
// ⚪ STEP 8: Send response