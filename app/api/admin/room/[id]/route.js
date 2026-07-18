import { NextResponse } from "next/server";
// Used to send responses in Next.js API route
import dbConnect from "@/utils/dbConnect";
import Room from "@/app/model/room";
import Facility from "@/app/model/facility";

import MultiImage from "@/app/model/multiImage";
import RoomNumber from "@/app/model/roomnumber";
// req (Request object) This is the incoming HTTP request
// This contains extra info about the route
export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context?.params;
//   Extracts id from URL
//   Because your API route is dynamic:/api/room/[id]
   console.log("******id", id)

  if (!id) {
    return NextResponse.json(
      { error: "Room ID is required." },
      { status: 400 }
    //   400 (Bad Request)
// 👉 Client sent invalid request
    );
  }

  const body = await req.json();
//   Reads data sent from frontend
  console.log("Received update data:", body);

  try {
    const facilities = body.facilities || [];
    // Reads facilities from the request body
    const galleryImages = body.gallery_images || [];
    // Pulls image array from request
    delete body.facilities;
    delete body.gallery_images;
    // Separate arrays from body
    // Because your Room schema likely does NOT have these fields
    const updateData = {};
    // This will store only valid, clean fields for updating Room
    for (const key in body) {
        // Iterates over all keys in body
      if (body[key] !== null && body[key] !== undefined && body[key] !== "") {
        updateData[key] = body[key];
        // Only clean values go into update
      }
    }

    console.log("Filtered update data:", updateData);
//     await Room.findByIdAndUpdate(...)
//  This is a Mongoose method that:
//     Finds a document by _id
//     Updates it
//     Returns a result
    const updatingRoom = await Room.findByIdAndUpdate(
      id,
    //   The ID of the room you want to update
      { $set: updateData },
    //   This is the update operator
//  What $set does:updates only the given fields
      {
        new: true,
        // Returns the updated document     
        runValidators: true,
        // Forces schema validation during update
      }
    );
    // Checks if update failed because: No document with that id exists
    if (!updatingRoom) {
        //   404 (Not Found)
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }
//     Try to find room by ID
// Update it using $set
// Validate data
// Return updated document
// If not found → return 404

    if (facilities.length > 0) {
        // If the client sent a non-empty array of facilities → go to update path
      await Facility.deleteMany({ room_id: id });
    //   Removes all facility documents linked to this room
      const facilityPromises = facilities.map((facilityName) =>
        // Loop over each facility string
        Facility.create({
          room_id: id,
          facility_name: facilityName,
        })
        // For each item, create a new DB document
      );
      await Promise.all(facilityPromises);
    //   Runs all .create() operations concurrently
// Waits until all are done/
    } else {
      await Facility.deleteMany({ room_id: id });
    //   If facilities = []: Don’t create anything Just delete all existing facilities
    }

//     Case A: Facilities provided
// Receive facilities = ["WiFi", "AC"]
// Delete all existing facilities for room
// Insert new facilities
// Done
// Case B: Empty array
// Receive facilities = []
// Delete all existing facilities
// Don’t insert anything
// Room ends up with no facilities

    if (galleryImages.length > 0) {
        // Check if the request contains any images
      await MultiImage.deleteMany({ room_id: id });
      //   Delete all existing images for this room
      const imagePromises = galleryImages.map((imageUrl) =>
        // Loop over each image URL
        MultiImage.create({
          room_id: id,
          multi_image: imageUrl,
        })
        // For each item, create a new DB document
      );
      await Promise.all(imagePromises);
    //   Runs all .create() operations concurrently
// Waits until all are done/
    } else {
      //   If no images provided: Just delete all existing images
      await MultiImage.deleteMany({ room_id: id });
    }
    // Scenario 1: User updates images
    // Old images deleted
    // New images inserted
    // Scenario 2: User removes all images
    // Old images deleted
    // Nothing inserted

    return NextResponse.json({ success: "successfully updated" });
    // Default = 200 OK
// 👉 Everything worked
  } catch (err) {
    console.error("Error updating Room:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
    // 500 (Internal Server Error)
// 👉 Something broke in backend
  }
}

// Client sends request
// PUT /api/room/123
// 2. Server connects to DB
// 3. Extract ID
// If missing → ❌ 400
// 4. Read request body
// 5. Separate:
// facilities
// gallery images
// 6. Clean data (remove empty values)
// 7. Update Room
// If not found → ❌ 404
// 8. Replace Facilities
// Delete old
// Insert new
// 9. Replace Images
// Delete old
// Insert new
// 10. Return success → ✅ 200
// 11. If error → ❌ 500