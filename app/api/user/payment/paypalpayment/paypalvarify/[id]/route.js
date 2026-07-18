// Import necessary modules and functions
import { NextResponse } from "next/server";
// Used to send responses in Next.js API routes.
import dbConnect from "@/utils/dbConnect";
import Booking from "@/app/model/booking";
import paypal from "@paypal/checkout-server-sdk"; // PayPal SDK
// Official PayPal backend SDK.
// Configure PayPal environment (Sandbox mode)
let environment = new paypal.core.SandboxEnvironment(
    "Acz_TXEJUUNX2cMCMwDb-3Fs4l7CbXrblfzhVsl9ypH_N0f_Ph_F_oJqYN57cjQMajqta9Slj8jeRVZm",
    "EHvoT8ggimdQfNl-_JpwhL5m5O8Nc1TGh8iWoVvbYZfJSrnbSPDv-9BGmCe6-EuFmrLEMPx9dnD-7gwc"
  );
//   Sandbox = testing mode (not real money)

// Create a PayPal client
let client = new paypal.core.PayPalHttpClient(environment);
// Creates PayPal client
// Used to send API requests to PayPal
export async function GET(req, context) {
  // Connect to the database
  await dbConnect();
  console.log("✅ Connected to database");

  const { id } = await context.params;
//   Extracts PayPal order ID from URL
  console.log("🆔 Received PayPal order ID:", id);

  if (!id) {
    console.log("❌ Missing PayPal order ID in request");
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    // Create a request to capture the order
    const request = new paypal.orders.OrdersCaptureRequest(id);
    request.requestBody({});
     // Required by SDK, even if empty
     
    console.log("📦 Created PayPal capture request");

    // Execute PayPal request
    const response = await client.execute(request);
    // Sends request to PayPal
    console.log("✅ PayPal response received:", JSON.stringify(response, null, 2));

    // Extract reference (booking) ID
    const bookingId = response?.result?.purchase_units?.[0]?.reference_id;
    // responseThis is what PayPal returned after capturing payment
    // response.result
// The actual useful data is inside .result.
// Each item represents a payment unit 
// [0]Access the first item in the array
// .reference_id
// This is the key link between PayPal and your DB
    const status = response?.result?.status;
    // his is the payment status from PayPal
    console.log("📄 Payment Status:", status);
    console.log("📎 Booking ID (from reference_id):", bookingId);

    // Proceed if payment is completed
    if (status === "COMPLETED") {
      const updatedBooking = await Booking.findByIdAndUpdate(
        // Finds booking in DB using ID and update it
        bookingId,
        {
          transaction_id: response.result.id,
        //   This is PayPal’s order/capture ID
          payment_status: "1",
        //   You’re marking payment as successful
        },
        { new: true }
        // Returns updated document,
      );

      if (!updatedBooking) {
        console.log("❌ Booking not found with ID:", bookingId);
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      console.log("✅ Booking updated successfully:", updatedBooking);

      return NextResponse.json(
        { success: "Payment successful and booking updated" },
        { status: 200 }
      );
    } else {
      console.log("❌ Payment not completed. Status:", status);
      return NextResponse.json(
        { failed: "Payment failed, try again" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.log("💥 Error during payment capture:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// User approves payment on PayPal
// PayPal redirects to your frontend
// Frontend calls this API with orderId
// This API:
// Captures payment from PayPal
// Gets booking ID from PayPal response
// Checks if payment is COMPLETED
// Updates booking in DB
// Returns success