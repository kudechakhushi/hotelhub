import { NextResponse } from "next/server";
// Used to send responses in Next.js App Router
import dbConnect from "@/utils/dbConnect";

import Category from "@/app/model/category";

export async function PUT(req, context) {
    // req → request object (body, headers, etc.)
// context → contains route params (like id)
  await dbConnect();

  const body = await req.json();
//   Reads incoming JSON body
  const { id } = await context?.params;
//   Extracts id from URL
  try {
//     Extract _id  
// 2. Put everything else into updateBody
// Example Input
// body = {
//   _id: "123",
//   name: "Luxury",
//   createdAt: "fake"
// }
// After this line:
// _id = "123"
// updateBody = {
//   name: "Luxury",
//   createdAt: "fake"
// }
//  Why remove _id? Because: _id is immutable in MongoDB
    const { _id, ...updateBody } = body;

    const updatingCategory = await Category.findByIdAndUpdate(
      id,
    //   Which document to update
      updateBody,
    //   Fields to change
      { new: true }
    //   Return updated document (not old one)
    );
    //   Sends updated document back to frontend
    return NextResponse.json(updatingCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
    // req → request object (body, headers, etc.)
// context → contains route params (like id)
  await dbConnect();

  const { id } = await context?.params;
//   Extract ID from URL
  try {
    const deletingCategory = await Category.findByIdAndDelete(id);
    // Deletes the document
    return NextResponse.json(deletingCategory);
    // Sends deleted document (or null)
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

// UPDATE
// Client sends PUT → extract id → remove _id from body
// → update document → return updated data
// DELETE
// Client sends DELETE → extract id
// → delete document → return deleted data