// Import necessary modules and functions
import { NextResponse } from "next/server";
// Used to send responses in Next.js App Router API routes.
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";

// GET handler for fetching monthly user counts
export async function GET(req) {
  await dbConnect();

  try {
    // Aggregate users by month
    // Process all users and give me grouped data.”
    //aggregate = pipeline (step-by-step data transformation).
    const monthlyUsers = await User.aggregate([
      {
        $group: {
            // Starts grouping documents.
          _id: {
            // Defines how you group data.
            year: { $year: "$createdAt" },
            // Extracts year from createdAt.
            month: { $month: "$createdAt" }
            // Extracts month number (1–12).
          },
          count: { $sum: 1 }
//           For each group:Add 1 per user
// Total = number of users in that month
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
//         Sorts results:First by year
// Then by month
      },
      {
        $project: {
          _id: 0,
        //   Removes MongoDB’s _id field
          year: "$_id.year",
          month: "$_id.month",
        //   Pulls values out of _id into top-level fields
          count: 1
        //   Keeps count as-is
        }
      }
    ]);

    // Loop through each result
    const formattedData = monthlyUsers.map(item => {
      const date = new Date(item.year, item.month - 1);
    //   JS months = 0-based Jan = 0
      return {
        name: date.toLocaleString('default', { month: 'short' }) + ' ' + item.year,
        // Converts month to short text: Combines with year:
        users: item.count,
        // Renames count → users
        monthYear: date.toLocaleString('default', { month: 'short', year: 'numeric' })
        // Produces:Jan 2026
      };
    });

   

     console.log("(formattedData" ,formattedData)
    return NextResponse.json(formattedData);
    // Returns formatted data as JSON response
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// Raw Data (Database)
// User documents:
// - user1 → Jan 5
// - user2 → Jan 20
// - user3 → Feb 2
// 2. Aggregation (Database Level)

// 👉 MongoDB groups them:

// Jan → 2 users
// Feb → 1 user
// 3. Sorting

// 👉 Ensures time order:

// Jan → Feb → Mar
// 4. Formatting (Backend → Frontend)

// 👉 Convert into UI-friendly format:

// { name: "Jan 2026", users: 2 }
// 5. Visualization (Frontend)

// 👉 Chart reads:

// X-axis → name
// Y-axis → users