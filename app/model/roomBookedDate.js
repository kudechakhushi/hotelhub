import mongoose from "mongoose";
import Booking from "./booking";
import Room from "./room";
const roomBookedDateSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    // RoomBookedDate → Booking
    // Stores reference to a booking
    // ref: "Booking" means:
    // → You can use .populate("booking_id") later
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
//     Links to a room
// Again, enables .populate("room_id")
//  Relationship:RoomBookedDate → Room
    book_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RoomBookedDate ||
  mongoose.model("RoomBookedDate", roomBookedDateSchema);