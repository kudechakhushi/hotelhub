import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    // Stores image URL (or file path)
    name: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);