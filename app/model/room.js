import mongoose from "mongoose";

import RoomType from "./roomtype";

const roomSchema = new mongoose.Schema(
  {
    roomtype_id: {
      type: mongoose.Schema.Types.ObjectId,
    //   This is your "foreign key equivalent"
    // Room.roomtype_id → points to → RoomType._id
      ref: "RoomType",
      required: true,
    },

    total_adult: {
      type: String,
      default: null,
    },

    total_child: {
      type: String,
      default: null,
    },

    room_capacity: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },

    price: {
      type: String,
      default: null,
    },

    size: {
      type: String,
      default: null,
    },

    view: {
      type: String,
      default: null,
    },
    bed_style: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: 0,
    },
    short_desc: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
    },

    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
// Use existing Room model if it exists, otherwise create a new one.”