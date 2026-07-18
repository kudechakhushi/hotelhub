// this is for admin to get and post team members with api 
import { NextResponse } from "next/server";
// Used to send responses from your API
import dbConnect from "@/utils/dbConnect";

import Team from "@/app/model/team";

export async function GET() {
  await dbConnect();

  try {
    const team = await Team.find({});
    // Fetches ALL documents from the team collection
    return NextResponse.json(team);
    // Sends data to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
//   Reads request body (JSON from frontend)
  const { name, image, position } = body;
//   Extracts fields:
//   name → person name
//   image → image URL
//   position → role/job title
  
  try {
    const team = await Team.create({
      name,
      image,
      position,
    });
    // Inserts new document into MongoDB 
    console.log("team", team);

    return NextResponse.json(team);
    // Sends created data back
  } catch (error) {

     console.log(error)
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
// GET:
// Frontend → /api/team → DB → return all team members
// POST:
// Frontend form → /api/team (POST)
// → extract body
// → save in DB
// → return created record