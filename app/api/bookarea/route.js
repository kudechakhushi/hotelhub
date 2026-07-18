// this is api route for snap booking section show to client on dashboard page
import { NextResponse } from "next/server";
// Used to send response back (like res.json() in Express)
import dbConnect from "@/utils/dbConnect";
// Connects to MongoDB
import BookArea from "@/app/model/bookarea";
// Finds ONE document from collection
export async function GET(req) {
  await dbConnect();
  try {
    let promo = await BookArea.findOne();
    // Gets ONE document from collection Fetches one document from collection   

    if (!promo) {
      promo = {
        shortTitle: "",
        mainTital: "",
        shortDesc: "",
        linkUrl: "",

        photoUrl: "",
      };
      // If DB returns nothing, you return empty structure
    }

    return NextResponse.json(promo);
    // Sends JSON response to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}