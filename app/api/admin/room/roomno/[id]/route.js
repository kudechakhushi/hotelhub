import { NextResponse } from "next/server";
// Used to send responses back (like res.json() in Express)
import dbConnect from "@/utils/dbConnect";
import RoomNumber from "@/app/model/roomnumber";
// req → request data
// context → route info (like params)
export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context?.params;
//   Gets id from the route 
//   Because your API route is dynamic:/api/room/roomno/[id]
  if (!id) {
    //   400 (Bad Request)
    return NextResponse.json({ error: "Room Id is required" }, { status: 400 });
  }

  const body = await req.json();
//   Reads JSON sent from frontend
  try {
    const updatedRoomNumber = await RoomNumber.findByIdAndUpdate(id, body, {
      new: true,
    });
//     Find document by id
// Update using body
// Return updated document (new: true)

    if (!updatedRoomNumber) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: "Room successfully updated",
      data: updatedRoomNumber,
    });
    // Sends updated data back
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context?.params;
//   Gets id from the route 
    // Because your API route is dynamic:/api/room/roomno/[id]
  try {
    const deletingRoomNumber = await RoomNumber.findByIdAndDelete(id);
// Removes document from DB
    return NextResponse.json(deletingRoomNumber);
    // Returns deleted document
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}