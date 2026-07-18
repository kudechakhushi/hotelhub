import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Team from "@/app/model/team";
// reqThis contains everything coming from the client request.
// contextThis contains URL-related data, especially dynamic params.
export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context?.params;
//   Extracts id from URL params
  if (!id) {
    return NextResponse.json({ error: "Team member id required" });
  }

  try {
    const body = await req.json();
    // Reads request body
    // This contains updated data
    const updatingTeam = await Team.findByIdAndUpdate(id, body, {
      new: true,
    });
    // Finds document by ID
    // Updates it with body
    // { new: true } → returns updated version
    if (!updatingTeam) {
      return NextResponse.json({ error: "Team memer not found" });
    }

    return NextResponse.json(updatingTeam);
    // Returns updated object
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deleteingTeam = await Team.findByIdAndDelete(context.params.id);
    // Finds document by ID
    // Deletes it

     console.log("deleteingTeam",deleteingTeam)
    return NextResponse.json(deleteingTeam);
    // Returns deleted object
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
// PUT (Update)
// Frontend → PUT /api/team/:id
// → extract id
// → read body
// → update DB
// → return updated object
// DELETE
// Frontend → DELETE /api/team/:id
// → extract id
// → delete from DB
// → return deleted object