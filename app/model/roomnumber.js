import mongoose from "mongoose";

import RoomType from "./roomtype";

import Room from "./room";

const roomNumberSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    //   Reference to a Room
// Enables .populate("room_id") This room number belongs to a specific room entity
    },
    roomtype_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
    //   Links to room category/type
    },

    room_no: {
      type: String,
      default: null,
      //   Stores the room number (like "Room 101", "Room 102")

    },

    status: {
      type: Number,
      default: 0,
    },
//     Numeric status flag
//  Likely meaning:  0 → available 1 → occupied

  },
  { timestamps: true }
);

export default mongoose.models.RoomNumber ||
  mongoose.model("RoomNumber", roomNumberSchema);