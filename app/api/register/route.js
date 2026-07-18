import mongoose from "mongoose";
import { NextResponse } from "next/server";
// Used to send response back to frontend
// Replaces Express res.json()

import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import bcrypt from "bcrypt";
// This is a Next.js API route that handles user registration. backend logic
// This runs ONLY when:POST /api/register
// So when your frontend does:
// fetch('/api/register', { method: "POST" }) THIS function runs.
export async function POST(req) {
  // uns when frontend calls:
  await dbConnect();

  const body = await req.json();
  // Converts request body into JSON
  const { name, email, password, phone } = body;
  // Extract values
  try {
    const existingUser = await User.findOne({ email });
    // It sends a response from your backend API to the frontend
//     Converts data → JSON
// Sends it as HTTP response
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user =await new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber: phone,
    }).save(); 

    return NextResponse.json({
      message: "User registered successfully",
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}