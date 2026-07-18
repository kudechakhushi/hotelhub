import mongoose from "mongoose";
// Brings in the Mongoose library
const CategorySchema = new mongoose.Schema(
    // You’re defining the structure of documents in MongoDB
  {
    name: {
      type: String,
      required: true,
      trim: true,
    //   Removes whitespace automatically
    },
  },
  // Adds createdAt and updatedAt fields automatically
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);

//   mongoose.model("Category", CategorySchema)Creates a Model
// mongoose.models.Category Checks if model already exists