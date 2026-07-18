import mongoose from "mongoose";

import Room from "./room";
// Room → Many Facilities (1:N relationship)
const facilitySchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      // Stores ID of the room. One room → multiple facilities
// ref: "Room" → creates relation with Room model.
    },

    facility_name: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Facility ||
  mongoose.model("Facility", facilitySchema);