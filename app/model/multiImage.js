import mongoose from "mongoose";

import Room from "./room";

const multiImageSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      // Stores the ID of the room.
// ref: "Room" → connects this image to a specific room.
    },

    multi_image: {
      type: String,
      default: null,
      // Stores image path or URL.
    },
  },
  { timestamps: true }
);

export default mongoose.models.MultiImage ||
  mongoose.model("MultiImage", multiImageSchema);