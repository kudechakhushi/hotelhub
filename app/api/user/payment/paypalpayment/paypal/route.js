// same code as razorpaypayment/razorpay/route.js
import { NextResponse } from "next/server";
// Used to send API responses
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";
// Used to check logged-in user
import paypal from "@paypal/checkout-server-sdk";
// PayPal SDK
import Booking from "@/app/model/booking";
import RoomBookedDate from "@/app/model/roomBookedDate";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(
  "Acz_TXEJUUNX2cMCMwDb-3Fs4l7CbXrblfzhVsl9ypH_N0f_Ph_F_oJqYN57cjQMajqta9Slj8jeRVZm",
  "EHvoT8ggimdQfNl-_JpwhL5m5O8Nc1TGh8iWoVvbYZfJSrnbSPDv-9BGmCe6-EuFmrLEMPx9dnD-7gwc"
);
// Creates PayPal sandbox environment
let client = new paypal.core.PayPalHttpClient(environment);
// Creates PayPal client to send requests
function generateBookingCode(length = 8) {
    // Generates random booking code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
    // Creates array of random characters
//     Math.random() → random number (0 to 1)
// * chars.length → scale to string length
// Math.floor(...) → convert to integer index
// chars[...] → pick a random character
//  So each slot gets a random character from chars
  ).join("");
//   Converts array → string.
}

function generateDateRange(startDate, endDate) {
  const dates = [];
//   Converts input → Date object.
  const current = new Date(startDate);

  while (current <= new Date(endDate)) {
    // Adds current date to dates array
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
    // Increments date by 1 day
  }

  return dates;
  // Returns array of dates
}

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
//   Checks logged-in user
  console.log("sessionxxxxxxxxxxxxxxxxx", session);

  if (!session?.user?.id) {
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
    // Data from frontend

    const { country, name, email, phone, address, state, zipCode } =
      billingDetails;
    //   Extract billing details

    const newBooking = new Booking({
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

    await newBooking.save();
    // Saves to DB
    if (!room_id || !newBooking?._id || !checkIn || !checkOut) {
      return NextResponse.json({ message: "Missing fields" });
    }

    const dates = generateDateRange(checkIn, checkOut);
    // Creates date list
    const bookedDates = dates.map((date) => ({
      booking_id: newBooking?._id,
      room_id,
      book_date: date,
    }));
    // Converts into DB records
    await RoomBookedDate.insertMany(bookedDates);
    // Stores all booked dates

     
    const request = new paypal.orders.OrdersCreateRequest();
    // Create order request object
    request.prefer("return=representation");
    // Ask PayPal to return full response
  
    request.requestBody({
      application_context: {
     
        return_url: 'http://localhost:3000/dashboard/user/paypal/success', 
        cancel_url: 'http://localhost:3000/dashboard/user/paypal/cancel',
      },
      intent: 'CAPTURE', 
      // Ask PayPal to capture payment
      purchase_units: [{
      
        reference_id:   newBooking&& newBooking?._id.toString(), 
        // Links PayPal order → booking
        amount: {
            currency_code: "USD",
            value: (Number(total) / 83).toFixed(2), 
            // convert INR → USD for testing 
          },
      }]
    });

    const order = await client.execute(request);
    // Sends request to PayPal
    console.log('order===>', order.result.links);

    
    const approveLink = order.result.links.find((l) => l.rel === "approve")?.href;
    // order.result.links
// → PayPal returns an array of links 
// .find(...) Loops through each link object 
// l.rel === "approve" → looks for "approve" relation
// ?.href → if found, returns href value
    if (!approveLink) {
      return NextResponse.json({ err: "No PayPal approve link" }, { status: 500 });
    }
    return NextResponse.json({ id: approveLink });
    // You return the URL to frontend 
    // Frontend will:
// redirect user to PayPal


  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { err: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

// STEP 1: User submits booking form

// Frontend sends:

// room
// dates
// price
// billing info
// 🟡 STEP 2: Backend creates booking
// Saves booking in DB
// status = inactive
// payment_status = 0
// 🟡 STEP 3: Block dates
// Generate all dates
// Store in RoomBookedDate

// 👉 Prevents others from booking same room

// 🟡 STEP 4: Create PayPal order
// Send amount to PayPal
// Attach booking_id
// 🟡 STEP 5: Send approval link

// Frontend gets:

// order.result.links[1].href

// 👉 Redirect user to PayPal

// 🟡 STEP 6: User pays on PayPal
// PayPal processes payment
// Redirects to:
// success URL
// or cancel URL
// 🟡 STEP 7: (NOT IN THIS CODE)

// You must:
// 👉 Verify payment after success