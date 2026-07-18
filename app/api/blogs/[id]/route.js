// this is used in component/blogs/Blogs.js file when user click on image 
import { NextResponse } from "next/server";
// Used to send API responses
import dbConnect from "@/utils/dbConnect";
import BlogPost from "@/app/model/blog";
import Category from "@/app/model/category";

export async function GET(req, context) {
   // request is the HTTP request object
// context contains dynamic route params
  await dbConnect();
  const { id } = await context.params;
//   id comes from URL

  try {
    // Get the main blog post with category populated
    // Finds ONE post where: slug === id
    const post = await BlogPost.findOne({ slug: id })
      .populate('categories') 
      // Populate the category Replaces category ID with actual category document
      .lean();
    //   Converts Mongoose document → plain JS object

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get similar posts (from the same category)
    let similarPosts = [];
    if (post.categories) {
        // Only run if post has a category
      similarPosts = await BlogPost.find({
        _id: { $ne: post._id }, 
        // “Give me all posts EXCEPT this one”
        // Exclude current post
        categories: post.categories._id 
        // Find posts where category = this category”
        //find with same category Match the same category
      })
      .limit(4)
    //   Only return 4 similar posts
      .select('title slug image views likes createdAt') 
      //  Only return needed fields
      .lean();
    //   Again convert to plain JS object
    }
//     Check if current post has category
// Find other posts where:
// Category is same
// ID is different
// Limit results
// Send only important fields





    // Get all categories with counts
//     Join categories with blog posts
// matches category _id with blog categories
// stores matched posts in posts array
    const categories = await Category.aggregate([
      {
        $lookup: {
          // It works like SQL JOIN:
          from: "blogposts",
          // “Go to the blogposts collection
          localField: "_id",
          // Take _id from the current collection (Category)”
          foreignField: "categories",
          // Match it with the categories field in blogposts”
          as: "posts"
          // Store matched blog posts inside a new field called posts”
        }
      },
      {
        $project: {
          name: 1,
          count: { $size: "$posts" }
        }
        // name of category
// count = number of posts in that category
      },
      { $sort: { count: -1 } }
    //   Sort categories by post count (highest first)
    ]);

    return NextResponse.json({
      post: {
        ...post,
        // Copy original post data
        // Transform single category to array for frontend consistency
        // Force category into array format
        categories: post.categories ? [post.categories] : []
        
      },
      similarPosts,
      categories
    }, { status: 200 });
    // Include:
// similar posts
// category list with counts

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// Step 1: User clicks blog image

// Frontend calls:

// GET /api/blogs/my-first-blog
// Step 2: API starts
// Connects to DB
// Extracts id = "my-first-blog"
// Step 3: Fetch main blog
// findOne({ slug: "my-first-blog" })
// Step 4: Populate category
// Replaces category ID → actual category object
// Step 5: If not found → 404
// Step 6: Fetch similar posts
// Same category
// Excluding current blog
// Limit 4
// Step 7: Fetch category list
// Join categories with blogs
// Count posts per category
// Sort by popularity
// Step 8: Send response
// {
//   post: { ... },
//   similarPosts: [ ... ],
//   categories: [ ... ]
// }