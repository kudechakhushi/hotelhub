import { NextResponse } from "next/server";
// Used to send API responses in Next.js
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";

import Booking from "@/app/model/booking";

import RoomBookedDate from "@/app/model/roomBookedDate";
import Razorpay from "razorpay";
// Razorpay SDK for payments
// Initialize Razorpay instance using the key and secret from environment variables
var razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    await dbConnect();

    const body = await req.json();
    const { razorpay_payment_id } = body;
    //   Extracts payment ID sent from frontend
    try {
        // Fetch the payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        // Calls Razorpay API
        // 👉 Gets full payment details
        console.log("payment razorpay", payment);

        // Get the booking ID from payment notes
        const bookingId = payment.notes.booking_id;
        // You previously stored this when creating order
        // Check if payment is successful
        if (payment && payment.status === "captured") {
            //         payment
            // Makes sure Razorpay actually returned something
            // ✔️ payment.status === "captured"
            // Means payment is successfully completed
            // n Razorpay:
            // "created" → not paid
            // "authorized" → pending
            // "captured" → ✅ money received
            // Update the booking with payment details
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                // Finds booking using bookingId and updates it
                {
                    transaction_id: payment.id, 
                    // Use payment._id or payment.id as transaction_id
                    // Stores Razorpay payment ID
                    payment_status: "1",
                     // Or you can use "completed", "success", etc.
                    //  Marks payment as successful
                },
                { new: true } 
                // Return the updated document
            );

            if (!updatedBooking) {
                return NextResponse.json(
                    { error: "Booking not found" },
                    { status: 404 }
                );
            }

            console.log("Updated booking:", updatedBooking);

            console.log("Payment successful and booking updated")
            return NextResponse.json(
                { success: "Payment successful and booking updated" },
                // Sends success response to frontend
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { failed: "Payment failed, try again" },
                // Sends failure response
                { status: 500 }
            );
        }
    } catch (err) {
        console.log("payment error", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
// User pays via Razorpay
// Frontend sends payment_id
// Backend fetches payment from Razorpay
// Checks status = "captured"
// Gets booking_id from notes
// Updates booking → mark as paid