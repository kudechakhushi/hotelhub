import mongoose from "mongoose";

import Category from "./category";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    //   trim: true → removes whitespace from start/end
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    //   unique: true → no duplicates in DB
// lowercase: true → automatically converts input to lowercase
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    //   default: 0 → auto set when not provided
// min: 0 → cannot go negative
    },
    view: {
      type: Number,
      default: 0,
      min: 0,
    },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    //   ObjectId → stores a reference ID
// ref: "Category" → links to another collection
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", blogPostSchema);
//   mongoose.models.BlogPost → Checks if model already exists
// mongoose.model("BlogPost", blogPostSchema) Creates model named "BlogPost"