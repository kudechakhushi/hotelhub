// This is a Redux Toolkit slice that manages:
// Blog list
// Current blog
// Loading + error states
// API calls (via createAsyncThunk)
//  Think of it as:“Frontend state manager + API handler combined”


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// createAsyncThunk =“Run async code and automatically manage loading/success/error states”
// A function that creates:your stateyour reducers (functions that change state)
// your actions (things you dispatch)
import { toast } from "react-toastify";

export const fetchBlogPosts = createAsyncThunk(
  "blogs/fetchBlogPosts",
  // Creates an async action named:
  // this is auto create pending, fulfilled, rejected
  async () => {
    try {
      const response = await fetch(`/api/admin/blog`);
      // Calls your API
      if (!response.ok) {
        throw new Error(`failed to fetch blog posts ${response.status}`);
      }

      const data = await response.json();
      // Return data → goes to Redux store
      return data;
    } catch (error) {
      toast.error(`error loading blog post ${error.message}`);

      throw error;
    }
  }
);

export const fetchBlogPostById = createAsyncThunk(
  "blogs/fetchBlogPostById",
  // Creates an async action named:
  async (id) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`);
      // Gets one blog post
      if (!response.ok) {
        throw new Error(`failed to  fetch blog post  ${response.status}`);
      }

      const data = await response.json();

      return data;
      // Return data → goes to Redux store
    } catch (error) {
      toast.error(`error loadin  blog post ${error.message}`);

      throw error;
    }
  }
);

export const createBlogPost = createAsyncThunk(
  "blogs/createBlogPost",
  // Creates an async action named:
  async (blogData) => {
    try {
      // Sends data to your API
      const response = await fetch(`/api/admin/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
        // Sends data to backend
      });

      if (!response.ok) {
        throw new Error(`Failed to create blog post ${response.status}`);
      }

      const data = await response.json();
      // Return data → goes to Redux store
      toast.success("blog post created succesfully");
    } catch (error) {
      toast.error(`error creating blog post ${error.message}`);
      throw error;
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  "blogs/updateBlogPost",
  // Creates an async action named:
  async ({ id, ...blogData }) => {
    // Extracts id and rest of fields
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Tells serverI’m sending JSON data”
        },
        body: JSON.stringify(blogData),
        // Converts JS object → JSON string

      });

      if (!response.ok) {
        throw new Error(`Failed to updated blog post ${response.status}`);
      }

      const data = await response.json();
      // Convert server response → JS object
      toast.success("blog  post  updated successfuuly");

      return data;
      //       Sends updated blog back to Redux
      // Used in:
      // fulfilled → action.payload
    } catch (error) {
      toast.error(` error updating blog post  ${error.message}`);

      throw error;
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  "blogs/deleteBlogPost",
  // Creates an async action named:
  async (id) => {
    // Extracts id
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      // Sends DELETE request to backend
      if (!response.ok) {
        throw new Error(` failed to  delete blog post ${response.status}`);
      }

      toast.error("Blog post deleted successfully");

      return id;
      // You return only the ID
    } catch (error) {
      toast.error(`error deleting blog post  ${error.message}`);

      throw error;
    }
  }
);
// Creates Redux slice (state + reducers)
const blogSlice = createSlice({
  name: "blogs",
  // Namespace for actions
  // Example:blogs/clearCurrentPost
  initialState: {
    list: [],
    // tores all blog posts
    currenPost: null,
    //     Stores single selected blog post
    // Used for: blog detail page editing page
    loading: false,
    // Tracks request state
    error: null,
  },

  // This is where you define synchronous actions
  // (no API calls, just direct state updates)
  reducers: {
    // Define a reducer called clearCurrentPost
    // 👉 When called, it should reset the selected blog post
    // Set current post back to empty”
    clearCurrentPost: () => {
      state.currenPost = null;
    },
  },
  // This handles actions created by createAsyncThunk
  extraReducers: (builder) => {
    builder

      .addCase(fetchBlogPosts.pending, (state) => {
        // “When this specific action happens, run this reducer logic.”
        // Set loading to true
        // Clear any previous errors
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        //         stop loading
        // store fetched posts
        //  action.payload = array of posts/
      })

      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // stop loading
        // store error message
      })

      .addCase(fetchBlogPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Start loading one post
      })

      .addCase(fetchBlogPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currenPost = action.payload;
        // Store selected post
      })

      .addCase(fetchBlogPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // stop loading
        // store error message
      })

      .addCase(createBlogPost.pending, (state) => {
        state.loading = false;
        state.error = null;
        // Start loading new post
      })

      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = true;

        state.list.unshift(action.payload);
        // Adds new post to beginning of array
      })

      .addCase(createBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // stop loading
        // store error message
      })

      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Start loading update
      })
      // action.payload = updated blog post from backend
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (post) => post._id === action.payload._id
        );
        //         state.list = all blog posts
        // action.payload._id = updated post ID
        //  findIndex returns:
        // index (0,1,2...) if found
        // -1 if not found
        if (index !== -1) {
          // Check if post exists in list
          state.list[index] = action.payload;
          // Replace old post with updated one
        }
        // if the currently selected post (state.currenPost) is the same post that just got updated.
        // state.currenPost._id → ID of the post currently being viewed/edited.
        // action.payload._id → ID of the post returned from your API after update.
        if (state.currenPost?._id === action.payload._id) {

          state.currenPost = action.payload;
          // You replace the old currenPost with the fresh updated data from backend.
        }
      })

      .addCase(updateBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // stop loading
        // store error message
      })

      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = false;
        state.error = null;
        // Start loading delete
      })

      // state → R/edux state
// action.payload → usually contains the ID of the deleted post
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((post) => post?._id !== action.payload);
        // state.list → array of all blog posts
        // .filter(...) → creates a new array excluding something
        // action.payload → ID of the deleted post
        // The deleted post is removed from the list results
        if (state.currenPost?._id === action.payload) {
          // Check if the currently opened post is the one that got deleted
          state.currenPost = null;
          // If user was viewing the deleted post → clear it
        }
      })

      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // stop loading
        // store error message
      });
  },
});

// When you create a slice using createSlice, Redux Toolkit automatically generates:
// action creators for each reducer you defined\
// Then internally Redux creates something like:
// {
//   clearCurrentPost: () => ({ type: "blogs/clearCurrentPost" })
export const { clearCurrentPost } = blogSlice.actions;

export default blogSlice.reducer;
// This is the main reducer function created by createSlice

// dispatch(fetchBlogPosts())
//         ↓
//    pending → loading = true
//         ↓
//    fulfilled → data stored
//         ↓
//    rejected → error stored
// UI:
// dispatch(deleteBlogPost(id));
// Thunk runs:
// fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
// If success:
// return id;
// Redux triggers:
// deleteBlogPost.fulfilled
// Your reducer runs:
// state.list = state.list.filter(...)
// UI updates automatically