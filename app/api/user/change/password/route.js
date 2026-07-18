import { NextResponse } from "next/server";
// Used to send JSON responses
import dbConnect from "@/utils/dbConnect";

import bcrypt from "bcrypt";
// comparing passwords
// hashing new password
import User from "@/app/model/user";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";
// Used to get logged-in user session
export async function PUT(req) {
  await dbConnect();

  const body = await req.json();
  const { oldPassword, newPassword } = body;
//   Extracts data sent from frontend:
  console.log("oldPassword, newPassword ");
  console.log({ oldPassword, newPassword });

  const session = await getServerSession(authOptions);
//   Gets logged-in user
  try {
    let user = await User.findOne({ _id: session.user.id });
    // Checks if user is logged in
    if (!session?.user?.id) {
        return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
      }
    if (!user) {
      return NextResponse.json({ err: "user  not  found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    // Compares:
    // entered password
    // hashed password in DB
    if (!passwordMatch) {
      return NextResponse.json(
        {
          err: "Incorrect old  password",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Converts plain password → hashed version
    user.password = hashedPassword;
    // Replace old password
    await user.save();
    // Save to MongoDB
    return NextResponse.json(
      { msg: "password  changed successfully" },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
// Request comes (PUT)
//        ↓
// Connect DB
//        ↓
// Get oldPassword + newPassword
//        ↓
// Get session
//        ↓
// Check login
//        ↓
// Find user in DB
//        ↓
// Compare old password
//    ❌ Wrong → return error
//    ✅ Correct → continue
//        ↓
// Hash new password
//        ↓
// Save in DB
//        ↓
// Return success