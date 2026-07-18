//this is for client side dashboard page  and 
// same code as api/admin/teamlist/route.js annd not explain here
import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Team from "@/app/model/team";

export async function GET() {
  await dbConnect();

  try {
    const team = await Team.find({});

    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}