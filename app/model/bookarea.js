import mongoose from "mongoose";
// Mongoose = ODM (Object Data Modeling)
// It connects your JavaScript code to MongoDB
const bookareaSchema = new mongoose.Schema(
    
  {
    shortTitle: {
      type: String,
      default: "",
    },
//     Field name: shortTitle
// Type: String
// Default: empty string

    mainTital: {
      type: String,
      default: "",
    },

    shortDesc: {
      type: String,
      default: "",
    },

    linkUrl: {
      type: String,
      default: "",
    },

    photoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
//     This automatically adds:{ "createdAt": "...",
//   "updatedAt": "..." }
  }
);

export default mongoose.models.BookArea ||
  mongoose.model("BookArea", bookareaSchema);
//   mongoose.models.BookArea
// Checks if model already exists
// mongoose.model("BookArea", bookareaSchema)
// Creates a model