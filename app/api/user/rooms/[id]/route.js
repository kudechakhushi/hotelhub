// this room api is for client side validation
import { NextResponse } from "next/server";
// Used to send response in Next.js API routes
import dbConnect from "@/utils/dbConnect";
import Room from "@/app/model/room";
import { differenceInDays } from "date-fns"; // 
// Optional: use this for better date handling difference in days

export async function GET(req, context) {
  await dbConnect();

  try {
    const { id } = await context.params;
    // id contains entire query string 
    // Parse the parameters from the id string
    const params = new URLSearchParams(id);
    // Converts string into query-like object
    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");
    const roomId = params.get("roomId");
    // Extract values from URL
    const rooms = parseInt(params.get("rooms") || 1); // Default to 1 room
    const guests = parseInt(params.get("guests") || 1); // Default to 1 guest
    // Convert string → number
    // Default values:
    // rooms → 1
    // guests → 1
    console.log("Parsed parameters:", {
      checkIn,
      checkOut,
      roomId,
      rooms,
      guests,
    });

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    // Convert string → Date object
    const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));
    // Calculate number of nights
    // differenceInDays gives difference
    // Math.max(1, ...) ensures:
    // Minimum stay = 1 night
    // Fetch the room details
    const room = await Room.findById(roomId);
    // Get room details from MongoDB
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const pricePerNight = room.price || 0;
    const discountPercent = room.discount || 0;

    const subtotal = pricePerNight * nights * rooms;
    // total cost before discount
    const discountAmount = (subtotal * discountPercent) / 100;
    // Calculate discount value
    const total = subtotal - discountAmount;
    // Calculate final total
    const result = {
     
      subtotal,
      discountPercent,
      discountAmount,
      total,
    };

    console.log("calculate result ", result);

    return NextResponse.json(result);
    // end JSON response to client
  } catch (err) {
    console.log("Error fetching room details or calculating prices:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch room pricing" },
      { status: 500 }
    );
  }
}
