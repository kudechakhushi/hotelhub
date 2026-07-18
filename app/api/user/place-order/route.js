import { NextResponse } from "next/server";
// Used to send responses in Next.js API routes
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";
// Used to check if user is logged in
import Booking from "@/app/model/booking";
import RoomBookedDate from "@/app/model/roomBookedDate";

// Generate unique booking code
function generateBookingCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    // Creates array of random characters
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Generate date range between two dates (inclusive)
function generateDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
//   Start from check-in date
  while (current <= endDate) {
    dates.push(new Date(current));
    // Add each day
    current.setDate(current.getDate() + 1);
    // Move to next day
  }

  return dates;
}

export async function POST(req) {
  await dbConnect();
  console.log("✅ Connected to DB");

  const session = await getServerSession(authOptions);
//   Get user session
  console.log("🔐 Session:", session);

  if (!session?.user?.id) {
    // If user not logged in → reject
    console.warn("❌ User not authenticated");
    return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
  }

  try {
    const {
      pricePerNight,
      nights,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      rooms,
      guests,
      roomTypeName,
      room_id,
      checkIn,
      checkOut,
      image,
      billingDetails,
      paymentMethod,
    } = await req.json();
    // You extract:
    // pricing info
    // room details
    // user info
    // billing info
    console.log("🧾 Request Data:", {
      pricePerNight,
      nights,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      rooms,
      guests,
      roomTypeName,
      room_id,
      checkIn,
      checkOut,
      billingDetails,
      paymentMethod,
    });

    const { country, name, email, phone, address, state, zipCode } = billingDetails;
    // Extract billing details
    const generatedCode = generateBookingCode();

    console.log("🔢 Generated Booking Code:", generatedCode);

    // 🔄 Convert checkIn and checkOut to Date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        // If invalid → reject
      console.warn("⚠️ Invalid check-in or check-out date format");
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    const newBooking = new Booking({
      rooms_id: room_id,
      user_id: session.user.id,
      check_in: checkIn,
      check_out: checkOut,
      person: guests,
      number_of_rooms: rooms,
      total_night: nights,
      actual_price: pricePerNight,
      subtotal,
      discount: discountAmount,
      total_price: parseFloat(total.toFixed(2)),
      payment_method: paymentMethod,
      transaction_id: "",
      payment_status: 0,
      name,
      email,
      phone,
      country,
      state,
      zip_code: zipCode,
      address,
      code: generatedCode,
      status: "inactive",
    });

    await newBooking.save();
    console.log("💾 Booking saved:", newBooking?._id);

    if (!room_id || !newBooking?._id || !checkInDate || !checkOutDate) {
      console.warn("⚠️ Missing booking-related fields");
      return NextResponse.json({ message: "Missing fields" });
    }

    const dates = generateDateRange(checkInDate, checkOutDate);
    // Generate booked dates
    console.log("📅 Date range:", dates);

    const bookedDates = dates.map((date) => ({
      booking_id: newBooking._id,
      room_id,
      book_date: date,
    }));
    // Map to DB format
    console.log("📦 Final bookedDates to insert:", bookedDates);

    const inserted = await RoomBookedDate.insertMany(bookedDates);
    // Stores each date separately
    console.log("✅ RoomBookedDate entries inserted:", inserted.length);

    return NextResponse.json({ success: true, booking_id: newBooking._id });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    return NextResponse.json(
      { err: err.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

// Step-by-step:
// User clicks “Book Now”
// Frontend sends POST request
// Backend:
// Connects DB
// Checks login
// Extracts booking data
// Generates booking code
// Converts dates
// Creates booking (UNPAID)
// Saves booking
// Generates all booked dates
// Saves each date separately
// Returns booking ID