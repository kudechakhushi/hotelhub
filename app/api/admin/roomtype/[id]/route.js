import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Room from "@/app/model/room";
import Facility from "@/app/model/facility";
import MultiImage from "@/app/model/multiImage";
import RoomNumber from "@/app/model/roomnumber";

import RoomType from "@/app/model/roomtype";

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context.params;
//   Extracts ID from route
  try {
    const deletedRoomType = await RoomType.findByIdAndDelete(id);
    // Deletes the RoomType
    if (!deletedRoomType) {
      return NextResponse.json(
        {
          success: false,
          error: "Room Type not Found",
        },
        { status: 404 }
      );
    }

    const rooms = await Room.find({ roomtype_id: id });
    // Fetch all rooms linked to that room type
    const roomDeletionPromises = rooms.map(async (room) => {
        // Loop through each room
      await Facility.deleteMany({ room_id: room._id });
    //   Deletes all facilities linked to this room
      await MultiImage.deleteMany({ room_id: room._id });

    await RoomNumber.deleteMany({ room_id: room._id });
      return Room.findByIdAndDelete(room._id);
    //   Finally delete the room itself
    });

    await Promise.all(roomDeletionPromises);
    // Runs all deletions in parallel
    console.log("delete successfully");
    return NextResponse.json({
      success: true,
      message: "Room Type and all associated data deleted successfully",
      deletedRoomType: deletedRoomType,
      deletedRoomType: rooms.length,
    });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}