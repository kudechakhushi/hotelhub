import { NextResponse } from "next/server";
// This is how you send responses in Next.js
import dbConnect from "@/utils/dbConnect";

import Category from "@/app/model/category";

export async function GET() {
  await dbConnect();

  try {
    const category = await Category.find({}).sort({ createdAt: -1 });
//     Fetch all categories
// Breakdown:
// find({})
// Empty filter = get everything
// .sort({ createdAt: -1 })
// -1 = descending
// newest first
    return NextResponse.json(category);
    // Sends data to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
//   Reads request body
  const { name } = body;
//   Extracts name
  try {
    const category = await Category.create({ name });
    // Inserts new document into MongoDB
    return NextResponse.json(category);
    // Returns created object
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

// GET
// Request → connect DB → fetch all categories → sort → return JSON
// POST
// Request → connect DB → read body → create category → return result