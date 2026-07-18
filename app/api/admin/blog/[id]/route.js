import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import BlogPost from "@/app/model/blog";

import slugify from "slugify";

export async function PUT(req, context) {
  // req → incoming request
// context → contains route params (id)
  await dbConnect();

  const { id } = await context.params;
  // Extract id from URL
  const body = await req.json();
  // Extract request body
  try {
    const { _id, slug, ...updateBody } = body;
//     Removes _id → prevents changing document ID
// Removes slug → prevents manual override
// Rest goes into updateBody

    if (updateBody.title) {
      updateBody.slug = slugify(updateBody.title, { lower: true });
    }
    // If title changes:
// regenerate slug

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updateBody, {
      new: true,
    });
//     id → which document
// updateBody → what to change
// { new: true } → return UPDATED doc

    if (!updatedPost) {
      return NextResponse.json(
        { err: "Blog post  not  found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
    // Return updated document
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  const { id } =await  context.params;
// Extract id from URL
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    // Find and delete document
    if (!deletedPost) {
      return NextResponse.json({ err: "blof post not found" }, { status: 404 });
    }
    // Return success response
    return NextResponse.json({
      success: true,
      message: "blog post  deleted  successfully",
      deletedPost,
    });
  } catch (error) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

// PUT:
// Request hits /api/blog/:id
// Extract ID
// Parse body
// Remove protected fields
// Regenerate slug if needed
// Update DB
// Return updated post
// DELETE:
// Request hits /api/blog/:id
// Extract ID
// Delete from DB
// Return success