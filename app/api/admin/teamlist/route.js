// this api is for component\dashboard\admin\teamlist\Team.js that show on teamlist page of admin dashboard
import { NextResponse } from "next/server";
// Used to send response back to frontend
import dbConnect from "@/utils/dbConnect";

import Team from "@/app/model/team";

export async function GET() {
  await dbConnect();

  try {
    const team = await Team.find({});
    // Get ALL documents from team collection
    return NextResponse.json(team);
    // Sends data to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}