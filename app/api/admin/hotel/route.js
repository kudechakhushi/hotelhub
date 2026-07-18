import { NextResponse } from "next/server";
// Used to send responses in Next.js API routes.
import dbConnect from "@/utils/dbConnect";

import RoomType from "@/app/model/roomtype";

export async function GET() {
  await dbConnect();

  try {
    const roomtype = await RoomType.find({}).sort({ createdAt: -1 });
    // find({}) Fetches all documents 
    // .sort({ createdAt: -1 })
// Sorts results by createdAt-1 means:Descending order

    return NextResponse.json(roomtype);
    // Sends data as JSON to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}