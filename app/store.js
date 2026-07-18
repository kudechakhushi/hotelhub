"use client";
// Set up one place where all your app’s shared data lives, 
// and define how it updates.”
import { configureStore } from "@reduxjs/toolkit";
// The central place where all your data lives.
import categoryReducer from "@/slice/categorySlice";
import blogReducer from "@/slice/blogSlice";
// imprt this in layout.js
export const store = configureStore({
    // When something happens, use this logic to update state.
  reducer: {
    categories: categoryReducer,

    blogs: blogReducer,
  },
});

//example: Bank System
// store → central bank database
// reducers → rules for transactions
// actions → operations (deposit, withdraw)

// configureStore() is a function that creates a store.
// You didn’t write it, but it adds:
// Async support (createAsyncThunk)
// Safety checks
// Logging tools
//  Without this, your async code would break.