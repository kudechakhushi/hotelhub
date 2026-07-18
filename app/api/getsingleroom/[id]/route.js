import { NextResponse } from "next/server";
// Next.js helper to send API responses
import dbConnect from "@/utils/dbConnect";

import Room from "@/app/model/room";

import RoomType from "@/app/model/roomtype";

import Facility from "@/app/model/facility";

import MultiImage from "@/app/model/multiImage";

import RoomNumber from "@/app/model/roomnumber";



// GET function to fetch all rooms with populated roomtype and facilities
export async function GET(req ,context) {
  // Establishing a connection to the database
  await dbConnect();
 const {id}=await  context.params;
 // extract id from URL
  try {
    
    const rooms = await Room.find({_id:id})
    // Fetch room by ID
    // Replaces roomtype_id with actual data
      .populate({
        path: "roomtype_id",
        model: RoomType,
        select: "name", 
      })
      .lean(); 
    //   Converts Mongoose docs → plain JS objects
 
    const roomIds = rooms.map((room) => room._id);
    // Creates array of IDs
   
    const roomFacilities = await Facility.find({
      room_id: { $in: roomIds },
    }).lean();
    // Get all facilities for these rooms

    const roomImages = await MultiImage.find({
      room_id: { $in: roomIds },
    }).lean();
    // Get all images
    const roomNumbers = await RoomNumber.find({
      room_id: { $in: roomIds },
    }).lean();
    // $in handles all at once
    // Get all room units
    const facilitiesMap = roomFacilities.reduce((map, facility) => {
        // Converts array → object map
      if (!map[facility.room_id]) {
        map[facility.room_id] = [];
        // If no entry → create array
      }
      // Add facility name to array
      map[facility.room_id].push(facility.facility_name);
      return map;
      // Return updated map
    }, {});

    // Create a map of room_id to images for efficient lookup
    const imagesMap = roomImages.reduce((map, image) => {
      if (!map[image.room_id]) {
        map[image.room_id] = [];
      }
      map[image.room_id].push(image.multi_image);
      return map;
    }, {});





const roomNumbersMap = roomNumbers.reduce((map, roomNumber) => {
  if (roomNumber.status === 1) {
    if (!map[roomNumber.room_id]) {
      map[roomNumber.room_id] = [];
    }
    map[roomNumber.room_id].push(roomNumber);
  }
  return map;
}, {});



  
    const responseData = rooms.map((room) => ({
        // Loop each room and attach extra data
      ...room,
    //   Copy original room fields
      facilities: facilitiesMap[room._id] || [], 
      //   Attach facilities array
      gallery_images: imagesMap[room._id] || [], 
      //   Attach images array
      room_numbers: roomNumbersMap[room._id] || [], 
      //   Attach room units array
    }));





    return NextResponse.json(responseData);
    // Sends JSON to frontend
  } catch (err) {
    console.log("Error fetching rooms:", err);
  
    return NextResponse.json(
      { error: err.message || "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// API called with room ID in room component
// Connect DB
// Fetch room
// Fetch:
// facilities
// images
// room numbers
// Convert arrays → maps (fast lookup)
// Merge everything
// Send final JSON