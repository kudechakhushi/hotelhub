import { NextResponse } from "next/server";
// Used to send responses back to frontend
import dbConnect from "@/utils/dbConnect";
import User from "@/app/model/user";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authoptions";
// This is your authentication layerGets logged-in user session
// Without this → anyone can hit your API
export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
//   getServerSession(...) → checks if the request has a valid login session (via cookies)
// authOptions → your NextAuth config (providers, callbacks, etc.)
// await → this is async because it reads cookies + verifies session
  const userId = session?.user?.id || session?.user?._id;
//   Because your user ID might come from:

//   NextAuth → id
//   MongoDB → _id
  const {
    name,
    email,
    password,
    profileImage,
    mobileNumber,
    address,
    country,
  } = await req.json();
// Reads the incoming request body
// Converts JSON → JavaScript object
  try {
    if (!userId) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
      // It sends a JSON response back to the client (frontend).
    }

    const updateData = {
      name,
      image: profileImage,
      mobileNumber: mobileNumber,
      address,
      country,
    };
// You’re building an object that will be sent to MongoDB for update.profileImage → stored as image
// mobileNumber → stored as phoneNumber
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
//       If password provided:
// Hash it
// Never store plain password
    }
// User.findByIdAndUpdate(...)
// Finds user by userId
// // Updates with updateData
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      // { new: true }

// Without this:Mongo returns OLD data
// With this: Mongo returns UPDATED data Removes password from result
    }).select("-password");

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

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || session?.user?._id;

  try {
    if (!userId) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ err: "user not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}