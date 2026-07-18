import { NextResponse } from "next/server";
// Used to send responses from API
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import bcrypt from "bcrypt";
// Used to hash password
import { getServerSession } from "next-auth/next";
// Gets logged-in user session
import { authOptions } from "@/utils/authoptions";
// Needed to validate session
export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // Gets current logged-in user
  const {
    name,
    email,
    password,
    profileImage,
    mobileNumber,
    address,
    country,
  } = await req.json();
  // Reads data sent from frontend
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ err: "not authenticated" }, { status: 401 });
    }

    let updatedUser = await User.findByIdAndUpdate(
      // Finds user by ID from session
      session.user.id,
      

      {
        name,
        password: await bcrypt.hash(password, 10),
        image: profileImage,
        mobileNumber,
        address,
        country,
      },
      { new: true }
      // Returns updated user instead of old one
    );

    if (!updatedUser) {
      return NextResponse.json({ err: "user not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "user updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

// UPDATE FLOW (POST)
// Frontend sends data
// → API POST runs
// → Connect DB
// → Check session (auth)
// → Hash password
// → Update user in MongoDB
// → Return success/error

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // Get session
  try {
    if (!session?.user?.id) {
      // Check authentication
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ _id: session?.user?.id });
    // Gets user data
    return NextResponse.json(user);
    // Return user
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
// FETCH FLOW (GET)
// Frontend calls API
// → API GET runs
// → Connect DB
// → Check session
// → Fetch user from DB
// → Return user data