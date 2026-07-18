import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// createSlice → to define state + reducers
// createAsyncThunk → to handle async API calls
import { toast } from 'react-toastify';
// Used for UI notifications

// Async thunks for API calls with error handling and notifications
export const fetchCategories = createAsyncThunk(
//     'categories/fetchCategories' = action name
// Redux will generate:
// pending / fulfilled / rejected
  'categories/fetchCategories',
  async () => {
    try {
      const response = await fetch(`/api/admin/categories`);
    //   Calls your backend
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      const data = await response.json();
    //   Success → send data to Redux store
     // toast.success('Categories loaded successfully!');
      return data;
    } catch (error) {
     // toast.error(`Error loading categories: ${error.message}`);
      throw error;
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  // 'categories/addCategory' = action name
  // newCategory → data sent from frontend
  async (newCategory) => {
    try {
      const response = await fetch(`/api/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
        // Sends { name: "something" } to backend
      });
      if (!response.ok) {
        throw new Error(`Failed to add category: ${response.status}`);
      }
      const data = await response.json();
      //   Success → send data to Redux store
      toast.success('Category added successfully!');
      return data;
    //   Returns created category → goes into store
    } catch (error) {
      toast.error(`Error adding category: ${error.message}`);
      throw error;
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  // 'categories/updateCategory' = action name
  // { id, name } → data sent from frontend
  async ({ id, name }) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.status}`);
      }
      const data = await response.json();
      //   Success → send data to Redux store
      toast.success('Category updated successfully!');
      return data;
        //   Returns updated category → goes into store
    } catch (error) {
      toast.error(`Error updating category: ${error.message}`);
      throw error;
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  // 'categories/deleteCategory' = action name
  // id → category ID to delete
  async (id) => {
    try {
        const response = await fetch(`/api/admin/categories/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status}`);
      }
      toast.success('Category deleted successfully!');
      return id;
      //   Returns deleted category ID → goes into store
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
      throw error;
    }
  }
);
// This file controls everything related to categories
const categorySlice = createSlice({
  name: 'categories',
//   Name of slice

  initialState: {
//     This is your starting data
// list → stores categories
// loading → tells UI if API is running
// error → stores error message
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
//   This is where you define your own synchronous actions.
  extraReducers: (builder) => {
    // This is where you handle actions that come from outside this slice.
    // reducers → actions YOU create
// extraReducers → actions created somewhere else
    //builder.addcase() When THIS action happens → update state like THIS”
    builder
      .addCase(fetchCategories.pending, (state) => {
        // When API starts → set loading = true
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // When API succeeds → store data
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        // When API fails → store error
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addCategory.pending, (state) => {
        // Clears error before request
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        // Adds new category to list action.payload = newly created category
        state.list.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        // Sets error when API fails
        state.error = action.error.message;
      })

      .addCase(updateCategory.pending, (state) => {
        // Clears error
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        // API success → update existing item

        // This searches for the item that matches the updated one.
        const index = state.list.findIndex((cat) => cat._id === action.payload._id);
         // Find the category by ID

        if (index !== -1) {
          state.list[index] = action.payload;
        //   state.list Your current categories in Redux
//  action.payload This is the updated category returned from backend
        //   Replace old category with updated one
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.error.message;
        // Store error
      })

      .addCase(deleteCategory.pending, (state) => {
        // Clears error
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // Remove category from list action.payload = ID
        state.list = state.list.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        // Store error
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;

// Why do you need extraReducers?

// Because of this:

// createAsyncThunk(...)

// 👉 It automatically creates actions like:

// fetchCategories.pending
// fetchCategories.fulfilled
// fetchCategories.rejected

// 👉 These are NOT inside reducers

// So Redux says:

// “Handle them in extraReducers”

//full flow 
// Example: Fetch Categories
// dispatch(fetchCategories)
// ↓
// pending → loading = true
// ↓
// API runs
// ↓
// success → fulfilled → list updated
// Example: Add Category
// dispatch(addCategory("Electronics"))
// ↓
// API call
// ↓
// success → push into list
// Example: Delete
// dispatch(deleteCategory(id))
// ↓
// API call
// ↓
// success → remove from list