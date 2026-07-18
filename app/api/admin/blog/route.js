import { NextResponse } from "next/server";
// Used to send responses back to client
import dbConnect from "@/utils/dbConnect";

import BlogPost from "@/app/model/blog";

import slugify from "slugify";
// Converts title → URL-friendly string
// e.g., "Hello World" → "hello-world"
export async function GET() {
  await dbConnect();

  try {
    const posts = await BlogPost.find({}).sort({
      createdAt: -1,
    });
    // find({}) → get ALL posts
    // sort({ createdAt: -1 }) →
    // newest first
    //  -1 = descending order
    return NextResponse.json(posts);
    // Send posts to frontend as JSON
  } catch (error) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  // Extract request body
  const { title, description, image, category } = body;
  // Destructure values
  console.log("body" , body)

  try {
    const post = await BlogPost.create({
      // Create new DB document
      title,
      slug: slugify(title, { lower: true }),
//       Generates URL slug
// Example "React Basics" → "react-basics"
      description,
      image,
      categories: category,
    });

    return NextResponse.json(post);
    // Send created post back
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

// GET:
// Request hits /api/blog
// Connect DB
// Fetch posts
// Return JSON
// POST:
// Frontend sends data
// API receives request
// Connect DB
// Parse JSON body
// Create document
// Save to DB
// Return created post