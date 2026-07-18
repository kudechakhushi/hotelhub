import { NextResponse } from "next/server";
// Used to send responses from your API
import dbConnect from "@/utils/dbConnect";

import BlogPost from "@/app/model/blog";

export async function GET() {
  await dbConnect();

  try {
    const posts = await BlogPost.find({}).sort({ createdAt: -1 });
    // BlogPost.find({})
    // fetch all documents{} = no filter.sort({ createdAt: -1 }) sort by newest first
    // -1 = descending
    return NextResponse.json(posts);
    // Returns data as JSON
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}