import { NextResponse } from "next/server";
// Used to send response back to frontend
import dbConnect from "@/utils/dbConnect";
// Your custom function to connect MongoDB
import { getServerSession } from "next-auth/next";
// Gets current logged-in user session
import { authOptions } from "@/utils/authoptions";
// Config for NextAuth 
import Booking from "@/app/model/booking";
export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
//   Checks:  Is user logged in?
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ err: "not authenticated" });
    }

    const userId = session.user.id;
    // Gets logged-in user ID
    const bookings = await Booking.find({ user_id: userId });
    // Find all bookings where:
    // user_id === current user
    console.log("booking", bookings);

    return NextResponse.json(bookings);
    // Sends data to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}