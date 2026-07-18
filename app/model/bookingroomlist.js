import mongoose from "mongoose";
import Room from "./room";
import Booking from "./booking";

import RoomNumber from "./roomnumber";

const bookingroomlistSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    //   ref: "Booking" → connects this document to Booking model.
    // One booking can have multiple entries in this collection.
    },

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: "Room",
    //   Without ref, you cannot populate room details.
    },

    room_number_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomNumber",
    //   Stores specific room number (like Room 101, 102).
    // ref: "RoomNumber" → connects this document to RoomNumber model.
    // One room can have multiple room numbers.
    },
  },
  { timestamps: true }
);

export default mongoose.models.BookedRoomList ||
  mongoose.model("BookedRoomList", bookingroomlistSchema);