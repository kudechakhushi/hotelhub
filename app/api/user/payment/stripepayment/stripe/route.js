import { NextResponse } from "next/server";
// Used to send API responses in Next.js
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";
// Used to check if user is logged in
import Stripe from "stripe";
// Stripe payment library.
import Booking from "@/app/model/booking";

import RoomBookedDate from "@/app/model/roomBookedDate";

const stripeInstance = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

function generateBookingCode(length = 8) {
    // Creates random booking ID
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
 }
// Picks random characters → joins into string

function generateDateRange(startDate, endDate) {
    // Creates list of all dates between check-in & check-out
  const dates = [];
  const current = new Date(startDate);

  while (current <= new Date(endDate)) {
    // Loop from start → end
    dates.push(new Date(current));
    // Add date
    current.setDate(current.getDate() + 1);
    // Move to next day
  }

  return dates;
}

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  console.log("sessionxxxxxxxxxxxxxxxxx", session);

  if (!session?.user?.id) {
    // If not logged in → reject
    return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
  }

  const user = await User.findOne({ _id: session?.user?.id });
//   Fetch User from DB
  if (!user) {
    return NextResponse.json({ err: "user not found" }, { status: 500 });
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
    // This is booking data sent from frontend

    const { country, name, email, phone, address, state, zipCode } =
      billingDetails;
    //   Extract Billing Info
    const newBooking = new Booking({
      rooms_id: room_id,
      user_id: session?.user?.id,
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
      code: generateBookingCode(),
      status: "inactive",
    });
    //   Save Booking to DB
    await newBooking.save();

    if (!room_id || !newBooking?._id || !checkIn || !checkOut) {
      return NextResponse.json({ message: "Missing fields" });
    }

    const dates = generateDateRange(checkIn, checkOut);
    // Store Booked Dates
    const bookedDates = dates.map((date) => ({
        // Get all dates
      booking_id: newBooking?._id,

      room_id,
      book_date: date,
    }));

    await RoomBookedDate.insertMany(bookedDates);
    // Save all booked dates
    const sessions = await stripeInstance.checkout.sessions.create({
        // Create Stripe Session
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
                // Product Info
              name: roomTypeName,
            },
            unit_amount: Math.round(total * 100),
            // Stripe uses paise → multiply by 100
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url:
        "http://localhost:3000/dashboard/user/stripe/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/dashboard/user/stripe/cancel",

      customer_email: user?.email,
      metadata: {
        booking_id: newBooking?._id.toString(),
        // This is how you link Stripe → your DB later
      },
    });

 console.log("sessions" ,sessions )

 return NextResponse.json({id:sessions.url})
//  Frontend will redirect user to Stripe checkout page

  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { err: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

// User clicks "Book Now"

// ➡️ Frontend sends booking data → API

// 2. Backend
// Connect DB
// Check login
// Fetch user
// 3. Booking Created (DB)
// Status = inactive
// Payment = unpaid
// 4. Dates blocked
// All dates inserted in RoomBookedDate

// ❗ Problem: done BEFORE payment

// 5. Stripe Session Created

// ➡️ Stripe checkout link generated

// 6. URL sent to frontend

// ➡️ User redirected to Stripe

// 7. User Pays (outside your system)
// 8. After Payment

// Stripe redirects to:

// success page OR
// cancel page