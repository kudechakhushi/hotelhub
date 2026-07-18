import { NextResponse } from "next/server";
// Used to send API responses in Next.js App Router
import dbConnect from "@/utils/dbConnect";

import Booking from "@/app/model/booking";

export async function GET() {
  await dbConnect();

  try {
    // Runs MongoDB aggregation pipeline
    // Group, calculate, and organize data inside the database 
    // instead of doing it manually in JavaScript
    const revenueData = await Booking.aggregate([
      {
        // Combine multiple booking records into one summary per month
        $group: {
          _id: {
            // Extracts year month takes createdAt field (date of booking)
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

        //   Adds up all total_price values in each group
          totalRevenue: {
            $sum: "$total_price",
          },
        //   Counts number of documents (bookings)
          count: { $sum: 1 },
        },
      },

      {
        // Sorts results in ascending order
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);



      console.log("revenueData" ,revenueData)
    return NextResponse.json(revenueData);
    // Sends data to frontend as JSON
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// User opens dashboard

// → React component runs

// 2️⃣ Frontend calls API
// fetch("/api/admin/sales")
// 3️⃣ Backend runs this code
// Connects DB
// Runs aggregation
// 4️⃣ MongoDB does:
// Group bookings by:
// year
// month
// Calculate:
// total revenue
// number of bookings
// 5️⃣ Backend sends response
// [
//   {
//     _id: { year: 2026, month: 7 },
//     totalRevenue: 6000,
//     count: 3
//   }
// ]
// 6️⃣ Frontend receives it

// Then your frontend:

// formats date
// sorts again (optional but safe)
// slices last 12 months
// renders chart