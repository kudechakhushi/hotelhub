import { NextResponse } from "next/server";
// Used to send API responses in Next.js
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";

import Stripe from "stripe";
// Stripe SDK
import Booking from "@/app/model/booking";

import RoomBookedDate from "@/app/model/roomBookedDate";

const stripeInstance = new Stripe(
  process.env.STRIPE_SECRET_KEY
);
// Creates Stripe instance using secret key

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context?.params;
//   Extracts id from URL
  try {
    const stripesession = await stripeInstance.checkout.sessions.retrieve(id);
    // Fetch payment details from Stripe using session ID
    const bookingId = stripesession?.metadata?.booking_id;
    // You stored this earlier during checkout get id from metadata
    if (stripesession && stripesession?.payment_status === "paid") {
        // Only proceed if payment is successful
      const updatedBooking = await Booking.findByIdAndUpdate(
        // Finds booking and updates it
        bookingId,
        {
          transaction_id: stripesession.id,
          payment_status: "1",
        //   Marks booking as paid
        },

        { new: true }
        // Returns updated booking
      );

      if (!updatedBooking) {
        return NextResponse.json(
          { error: "booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: "payment succcessfull and boking updated",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { failed: "payment  failed try  again" },

        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// User starts booking

// ➡️ Your POST API creates booking (inactive)

// 2. Stripe checkout session created

// ➡️ booking_id stored in metadata

// 3. User pays on Stripe
// 4. Stripe redirects to success page

// Example:

// /success?session_id=abc123
// 5. Frontend calls THIS API
// GET /api/verify/abc123
// 6. Backend:
// Fetch session from Stripe
// Check payment status
// Get booking_id
// Update booking
// 7. Booking becomes:
// payment_status = 1 ✅
// transaction_id stored ✅