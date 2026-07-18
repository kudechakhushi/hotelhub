import { NextResponse } from "next/server";
// Used to send responses in Next.js API routes
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";
// Used to get logged-in user session
// 👉 This is your authentication layer
import Booking from "@/app/model/booking";
import RoomBookedDate from "@/app/model/roomBookedDate"
import Razorpay from "razorpay";
// Razorpay SDK to create payment orders
// Initialize Razorpay instance using the key and secret from environment variables
var razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});
// Creates Razorpay instance using env variables
// If keys are wrong → payment fails


function generateBookingCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    //   This is your allowed characters set.
    return Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)]
        // This runs once for each element
        // So for 8 length → runs 8 times
        // Math.random() → gives number between 0 and 1
        // math.floor() Turns: 19.08 → 19
    ).join("");
}

function generateDateRange(startDate, endDate) {
    // startDate → check-in
    // endDate → check-out
    const dates = [];
    const current = new Date(startDate);
    // Converts string → Date object
    while (current <= new Date(endDate)) {
        // Loop runs until current date reaches endDate
        dates.push(new Date(current));
        // Takes the current dateCreates a copyStores it in the array
        current.setDate(current.getDate() + 1);
        // current.getDate() Gets the day of the month
        //     + 1
        // 10 + 1 = 11 setDate(...)
        // Updates the date
        // current.setDate(11)
    }

    // Save this date, then go to the next day"
    return dates;
}

export async function POST(req) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    // Gets logged-in user
    console.log("session", session);

    if (!session?.user?.id) {
        // If user not logged in:
        return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
        // 401 not authorized
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

        // This comes from frontend form

        console.log("billing", {
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
        })

        const { country, name, email, phone, address, state, zipCode } =
            billingDetails;
            // Extract Billing Details
            // Pulling nested object into variables.
        const newBooking = new Booking({
            // Creating a MongoDB document
            rooms_id: room_id,
            user_id: session?.user.id,
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
            // 0 probably means pending
            name,
            email,
            phone,
            country,
            state,
            zip_code: zipCode,
            address,
            code: generateBookingCode(),
            // Unique booking code generator
            status: "inactive",
            // Booking not confirmed yet
        });

        await newBooking.save();
        // Inserts into database
        if (!room_id || !newBooking?._id || !checkIn || !checkOut) {
            return NextResponse.json({ message: "Missing fields" });
        }

        const dates = generateDateRange(checkIn, checkOut);
        // Creates array of all dates between check-in & check-out
        const bookedDates = dates.map((date) => ({
            // dates is an array
            booking_id: newBooking?._id,
            // Links each date to the booking
            room_id,
            // Same room for all dates
            book_date: date,
            // Stores one day per record
        }));

        await RoomBookedDate.insertMany(bookedDates);
        // Stores one day per record


        const options = {
            amount: parseFloat(total.toFixed(2) * 100), 
            // Convert the course price to the smallest unit (paise) for Razorpay
            currency: "INR",
             // Set the currency to INR (Indian Rupee)
            receipt: "hotel_receipt", 
            // Define a unique receipt identifier for the order
            notes: {
                booking_id: newBooking?._id,
                 // Attach the course ID in the notes to be used later 
                 // (e.g., for tracking the course)
                //  Attach booking ID to payment
            },
        };

        // Create the Razorpay order using the specified options
        const order = await razorpay.orders.create(options);
        // Calls Razorpay API → creates payment order
        console.log("order RAZORPAY", order); // Log the created Razorpay order for debugging purposes

        // Return the order details as a JSON response
        return NextResponse.json(order);
        // Sends order back to frontend


    } catch (err) {
        console.error("Order creation error:", err);
        return NextResponse.json(
            { err: err.message || "Failed to create order" },
            { status: 500 }
        );
    }
}

// User clicks "Pay"

// ⬇️

// 2. Frontend sends POST request

// ⬇️

// 3. Backend:
// Creates booking ❌
// Blocks dates ❌
// Creates Razorpay order
// ⬇️
// 4. Returns order to frontend

// ⬇️

// 5. Razorpay popup opens

// ⬇️

// 6. User pays (or cancels)