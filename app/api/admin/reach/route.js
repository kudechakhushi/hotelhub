import { NextResponse } from "next/server";
// Used to send response in Next.js API
import dbConnect from "@/utils/dbConnect";

import Booking from "@/app/model/booking";

export async function GET() {
  await dbConnect();

  try {
    // This runs a MongoDB aggregation pipeline
    const countryData = await Booking.aggregate([
      {
        $group: {
            // This groups documents based on a field
            // Group all bookings by country”
            // Counts number of documents in each group
            // $sum: 1 → adds 1 for each document
          _id: "$country",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json(countryData);
    // Sends JSON to frontend
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// User hits API
// /api/admin/reach
// 2️⃣ Server connects to DB
// await dbConnect();
// 3️⃣ MongoDB runs aggregation
// Groups bookings by country
// Counts number of bookings per country
// 4️⃣ Returns processed data

// 👉 Not raw bookings — already summarized

// 🔁 Frontend Flow (your map)
// 5️⃣ React fetches API
// fetch("/api/admin/reach")
// 6️⃣ Receives:
// [
//   { _id: "India", count: 12 },
//   { _id: "USA", count: 8 }
// ]
// 7️⃣ Transforms into map data
// {
//   name: "India",
//   value: 1200,
//   coordinates: [...]
// }
// 8️⃣ Displays on map

// 👉 Bigger count → bigger bubble