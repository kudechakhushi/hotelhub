import { NextResponse } from "next/server";
// Used to send API response
import dbConnect from "@/utils/dbConnect";

import Room from "@/app/model/room";
import RoomType from "@/app/model/roomtype";
import Facility from "@/app/model/facility";
import MultiImage from "@/app/model/multiImage";
import RoomNumber from "@/app/model/roomnumber";

export async function GET() {
  await dbConnect();

  try {
    const rooms = await Room.find({})
    // Get all rooms
      .populate({
        path: "roomtype_id",
        // Field in Room that stores reference
        model: RoomType,
        // Which collection to fetch from
        select: "name",
        // Only return name field
      })
      .lean();
//       .lean() tells Mongoose:
// “Give me plain JavaScript objects, NOT full Mongoose documents”
    //   .populate() is a Mongoose feature that replaces a reference (ID) with 
    //   actual data from another collection. without this u get id not actual data
    //   Replace roomtype_id with actual data
    // { "roomtype_id": "abc123" }
// after{ "roomtype_id": { "_id": "abc123", "name": "Deluxe" } }
    const roomIds = rooms.map((room) => room._id);
    // Collect all room IDs
    const roomFacilities = await Facility.find({
      room_id: {
        $in: roomIds,
      },
    }).lean();
    // Get all facilities where room_id matches any room
    //$in Match any document where this field’s value exists in this array”
    const roomImages = await MultiImage.find({
        // Query the MultiImage collection
      room_id: {
        $in: roomIds,
      },
    }).lean();
    // Get all images where room_id matches any room
    //$in Match any document where this field’s value exists in this array”
    const roomNumbers = await RoomNumber.find({
        // Query RoomNumber collection
      room_id: {
        $in: roomIds,
      },
    }).lean();
    // Get all room numbers for these rooms”

    const facilitiesMap = roomFacilities.reduce((map, facility) => {
//         roomFacilities = array of objects (each has room_id, facility_name)
// .reduce() = looping through the array and building a single object (map)
// map = accumulator (your final result object)
      if (!map[facility.room_id]) {
        map[facility.room_id] = [];
      }
    //   If this room_id doesn’t exist in map, create an empty array
      map[facility.room_id].push(facility.facility_name);
//       map[facility.room_id]
// map = an object (like a dictionary / key-value store)
// facility.room_id = dynamic key
// .push() = array method
// It adds a new item to the end of an array
      return map;
    }, {});
    // Return updated map each iteration
    // {} = initial empty object
    const imagesMap = roomImages.reduce((map, image) => {
//         roomImages = array of image records from DB
// reduce() = loop through each item and build one final result
// map = accumulator (final object you're building)
// image = current item
      if (!map[image.room_id]) {
        map[image.room_id] = [];
      }
    //   If this room doesn’t have an array yet, create one”
      map[image.room_id].push(image.multi_image);
    //   ut this image into that room’s array”
      return map;
    //   Required for reduce() to keep building the result
    }, {});

    const roomNumbersMap = roomNumbers.reduce((map, roomNumber) => {
//         roomNumbers = array from DB
// reduce() = loops through every item
// map = final object you’re building
// roomNumber = current item
      if (!map[roomNumber.room_id]) {
        map[roomNumber.room_id] = [];
        // f this room doesn’t have a list yet, create one”
      }

      map[roomNumber.room_id].push(roomNumber);
    //   Put this entire roomNumber object into that room’s array”
      return map;
    //   Required for reduce() to keep updating
    }, {});
    // For each room:
    // take its base data
    // attach related data (facilities, images, numbers)
    // return a clean structured object
    const responseData = rooms.map((room) => ({
        // rooms = array of room objects from DB
// .map() = transforms each room into a new object
      ...room,
    //   Copy all existing properties of room”
      facilities: facilitiesMap[room._id] || [],
    //   Attach related data (facilities)
      gallery_images: imagesMap[room._id] || [],
    //   Attach related data (images)
      room_numbers: roomNumbersMap[room._id] || [],
    //   Attach related data (room numbers)
    }));
    // Look up this room’s facilities using _id
    // If found → use them
    // If not → return empty array
    return NextResponse.json(responseData);
    // Sends JSON response to client (frontend / API consumer)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// Step 1
// Fetch all rooms
// Step 2
// Extract room IDs
// Step 3
// Fetch related data:
// Facilities
// Images
// RoomNumbers
// Step 4
// Group them by room_id
// Step 5
// Attach grouped data to each room
// Step 6
// Return final structured response
// Room (main)
//    |
//    | roomtype_id
//    ↓
// RoomType

// Room
//    |
//    | _id → room_id
//    ↓
// Facility

// Room
//    |
//    | _id → room_id
//    ↓
// MultiImage

// Room
//    |
//    | _id → room_id
//    ↓
// RoomNumber