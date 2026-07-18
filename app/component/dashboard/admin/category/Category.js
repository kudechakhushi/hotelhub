import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
// useDispatch → sends data / triggers changes A hook that lets your component tell Redux to update state
// useSelector → reads data from store A hook to get data from Redux store
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/slice/categorySlice";
import { styles } from "./Categorystyles";
import AICategoryGenerator from "./AICategoryGenerator";
const CategoryManager = () => {
  const dispatch = useDispatch();
// "Send action → Redux → update global state"
// dispatch(action) → triggers API → updates store
  const { list: categories, loading } = useSelector(
    (state) => state.categories
  );
//   "Get data FROM Redux store"
// state = entire Redux store
// state.categories = your slice
// list renamed → categories

  const [filteredCategories, setFilteredCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");

  const [searchTerm, setSerchTerm] = useState("");

  const [editing, setEditing] = useState({
    id: null,
    name: "",
  });
  // Tracks edit mode

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);
  // Whenever Redux categories change:update local filtered list
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // Component loads
// → dispatch(fetchCategories)
// → API call
// → Redux store updates
// → UI re-renders

  const handleSaveCategory = () => {
    if (editing.id) {
      // If editing mode
      dispatch(
        updateCategory({
          id: editing.id,
          name: editing.name,
          // Update existing category
        })
      );
    } else {
      dispatch(addCategory(newCategory));
      // Create new category
      setEditing({ id: null, name: "" });

      setNewCategory("");
      // Reset form
    }
  };

  const handleSearch = (term) => {
    setSerchTerm(term);
    // Update search input
    if (term === "") {
      setFilteredCategories(categories);
      // Reset list
    } else {
      // Filter categories based on search term to lowercase
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(term.toLowerCase())
      );

      setFilteredCategories(filtered);
      // Update UI
    }
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
    // Sends delete action
  };

  const handleAICategorySelect = (category) => {
    setNewCategory(category);

    setEditing({ id: null, name: "" });
  };
//   Takes AI suggestion
// puts it into input field
// does NOT save to DB yet

  const handleAIAddCategory = (category) => {
    if (!category?.trim()) return;
  
    dispatch(addCategory(category));
    setNewCategory("");
  };
//   AI generates category
// User clicks "Add" (or AI triggers add)
// dispatch(addCategory)

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Category
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search Categories"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={styles.searchIcon} />
                </InputAdornment>
              ),
            },
            inputLabel: {
              sx: { color: "#8A12FC" },
            },
          }}
          sx={styles.searchInput}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        <TextField
          label={editing.id ? "Edit Category" : "Add Category"}
          variant="outlined"
          value={editing.id ? editing.name : newCategory}
          onChange={(e) =>
            editing.id
              ? setEditing({ ...editing, name: e.target.value })
              : setNewCategory(e.target.value)
          }
          slotProps={{
            inputLabel: {
              sx: { color: "#8A12FC" },
            },
          }}
          sx={{
            ...styles.searchInput,
            flex: 1, // field takes left space
          }}
        />
        <Button
          variant="contained"
          disabled={!newCategory.trim() && !editing.name.trim()}
          onClick={handleSaveCategory}
          sx={{
            ...styles.addButton,
            whiteSpace: "nowrap",
            minWidth: 120,
            height: 56, // matches TextField height
          }}
        >
          {editing.id ? "Update" : "Add"}
        </Button>
      </Box>

      <AICategoryGenerator
        onSelectCategory={handleAICategorySelect}
        onAddCategory={handleAIAddCategory}
      />

      <List>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : filteredCategories?.length > 0 ? (
          filteredCategories.map((category) => (
            <ListItem key={category?._id} divider sx={styles.listItem}>
              <ListItemText primary={category?.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <Edit
                    onClick={() =>
                      setEditing({ id: category?._id, name: category?.name })
                    }
                    style={{ color: "green" }}
                  />
                </IconButton>
                <IconButton edge="end" color="error">
                  <Delete onClick={() => handleDeleteCategory(category?._id)} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            {searchTerm
              ? "No categories match your search"
              : "You don't have any hotel categories yet. Please create one."}
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default CategoryManager;

// ADD FLOW
// User clicks Add
// → dispatch(addCategory)
// → API call
// → Redux store updates
// → categories changes
// → useSelector triggers re-render
// → UI updates
// FETCH FLOW
// Component mounts
// → dispatch(fetchCategories)
// → API call
// → store updated
// → UI re-renders
// DELETE FLOW
// Click delete
// → dispatch(deleteCategory)
// → API call
// → store updates
// → UI refresh

// FULL AI → DB FLOW

// Here’s the real chain:

// AI generates category string

// Passed to:

// handleAIAddCategory(category)

// This runs:

// dispatch(addCategory(category))
// Redux thunk:
// sends POST request
// saves to DB
// Redux store updates
// useSelector updates
// UI re-renders
// Category appears in list

// 👉 That’s it. No magic.

// AI doesn’t touch DB.

// 👉 Redux does.