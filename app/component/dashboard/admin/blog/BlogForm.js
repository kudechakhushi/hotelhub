// components/BlogForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Description,
  Title,
  Category,
  AddPhotoAlternate,
  AutoFixHigh,
} from "@mui/icons-material";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  selectStyles,
  menuItemStyles,
  submitButtonStyles,
  iconStyles,
  categoryIconStyles,
  alertStyles,
} from "./blogFormStyles";

import { useDispatch, useSelector } from "react-redux";
// useDispatch() → send actions
// useSelector() → read state
import { fetchCategories } from "@/slice/categorySlice";
import { createBlogPost } from "@/slice/blogSlice";
// These are your API calls
import { runAi } from "@/ai/ai";
// Calls AI to generate content

const BlogForm = () => {
  const dispatch = useDispatch();
  // dispatch is what you use to send actions to Redux.

  // categories → actual category data
  // categoriesLoading → loading state
  // useSelector(...) Lets you read data from the global store.
  // (state) => state.categoriesThis function grabs the categories slice from Redux.
  const { list: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
    // Pulls data from Redux store.
  );

  //   loading → kept as-is
  // blogLoading → already named that in store
  // error → renamed to blogError
  const {
    loading,
    blogLoading,
    error: blogError,
  } = useSelector((state) => state.blogs);
  //   (state) => state.blogs
  // Meaning:
  // Go into the Redux store
  // Grab the blogs slice
  // (state) => state.blogs
  // Accesses the blogs slice in Redux.
  const [formData, setFormDate] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [localError, setLocalError] = useState("");

  const [localSuccess, setLocalSuccess] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  // theme → your theme object
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // Detects mobile screen
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // Runs once → loads categories from backend
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Extracts field name + value
    setFormDate((prev) => ({
      ...prev,
      [name]: value,
    }));

  };
  // type = "title" or "description"
  // Checks if user selected a category
  const generateAIContent = async (type) => {
    if (!formData.category) {
      setLocalError("please select a category firt to generated  content");
      return;
    }

    // setIsGenerating(true) → shows loading spinner
    setIsGenerating(true);
    setLocalError("");
    // clears previous errors
    try {
      // Searches category list
      // Finds the one matching selected ID
      const selectedCategory = categories.find(
        (cat) => cat._id === formData.category
      );
      // If category exists → get name
      // else → empty string
      const categoryName = selectedCategory?.name || "";
      // Gets category description
      const categoryDescription = selectedCategory.description || "";
      // Sets up AI prompt
      let prompt = "";
      // Builds a very structured AI prompt
      // Includes:
      // word count rules
      // SEO rules
      // formatting rules
      if (type === "title") {
        prompt = `Generate 3 compelling blog post title options about "${categoryName}" with these specifications:
      - Each title must be 5-9 words exactly
      - SEO-optimized with primary keyword "${categoryName}"
      - Include power words (Ultimate, Essential, Proven, etc.)
      - Title case formatting
      - Spark curiosity while being clear
      - Avoid clickbait or misleading phrases
      
      Context: ${categoryDescription || "No additional context provided"}
      
      Return ONLY the 3 titles as a numbered list, nothing else.`;
      } else {
        prompt = `Write a detailed blog post description about "${categoryName}" with these requirements:
      - Exactly 300-600 words (9 concise paragraphs)
      - First paragraph: Hook and thesis statement
      - Second paragraph: 3-5 key benefits/features with examples
      - Third paragraph: Conclusion with call-to-action
      - Include secondary keywords: "${categoryName} tips", "${categoryName} guide"
      - Maintain a ${formData.tone || "professional"} tone
      - End with a thought-provoking question
      
      Category context: ${categoryDescription || "General category"}
      Target audience: ${formData.audience || "general readers"}
      
      Return ONLY the description content, no introductory text.`;
      }

      //       Much longer prompt Dynamic customization
      // Includes:word countparagraph structuretonekeywords

      const aiResponse = await runAi(prompt);
      // Sends prompt to AI function

      //       .split("\n")
      // splits into lines
      // [0]
      // takes first title only
      // .replace(/^\d+\.\s*/, "")

      // removes numbering like:

      // 1. Title here → Title here
      // .trim()
      // removes extra spaces
      const processedResponse =
        type === "title"
          ? aiResponse
            .split("\n")[0]
            .replace(/^\d+\.\s*/, "")
            .trim()
          : aiResponse;
      // raw response used
      setFormDate((prev) => ({
        // Updates form dynamically
        ...prev,
        // It copies everything from the previous state.
        [type]: processedResponse,
        //         type value	Result
        // "title"	{ title: processedResponse }
        // "description"	{ description: processedResponse }
      }));
    } catch (error) {
      setLocalError(
        `failed to genrated ${type} , ${error.message || "please try  again later"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Gets the first selected file from the input.
    if (file) {
      setImageFile(file);
      // Saves the actual file in state
      const reader = new FileReader();
      // Creates a browser API to read file content
      reader.onloadend = () => {
        // Runs when file reading is finished
        setImagePreview(reader.result);
        // Sets the preview to the base64-encoded image data
      };

      reader.readAsDataURL(file);

      // Converts it into a Data URL (base64 string)
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    // Required for file uploads (
    formData.append("file", imageFile);
    // Attach file
    formData.append("upload_preset", "ml_default");
    // Cloudinary preset
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      // Cloudinary preset
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      console.log("imag  response", response);
      // Converts response to JSON
      const data = await response.json();
      // Returns the secure URL Extracts uploaded image URL
      return data.secure_url;
    } catch (error) {
      console.log("error uploading image", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Stops page reload
    setLocalError();
    setLocalSuccess();
    // Clears previous messages
    console.log(formData);

    if (!formData.title || !formData.description || !formData.category) {
      setLocalError("please  fill in all required fiedl");
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        // Upload only if file exists
      }

      const blogPostData = {
        // Copies all form data
        ...formData,
        // Adds the uploaded image URL
        image: imageUrl,
      };

      await dispatch(createBlogPost(blogPostData)).unwrap();
      // This sends data to Redux → then to your API
      // It turns the dispatch result into a normal Promise that:
      //  returns real data on success
      setLocalError(true);
      setFormDate({
        title: "",
        description: "",
        category: "",
        image: "",
      });
      // Clears all form inputs

      setImagePreview("");
      setImageFile(null);
      // Removes stored file
      setLocalError("")
    } catch (error) {
      setLocalError(error.message || "Failed to create blog post");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
        New Blog Post
      </Typography>

      {(localError || blogError) && (
        <Alert severity="error" sx={alertStyles}>
          {localError || blogError}
        </Alert>
      )}

      {localSuccess && (
        <Alert severity="success" sx={alertStyles}>
          Blog post submitted successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Image Upload Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="blog-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="blog-image-upload">
            <IconButton component="span">
              {imagePreview ? (
                <Avatar
                  src={imagePreview}
                  sx={{ width: 1000, height: 400 }}
                  variant="rounded"
                />
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    border: "2px dashed #8A12FC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <AddPhotoAlternate sx={{ fontSize: 40, color: "#8A12FC" }} />
                </Box>
              )}
            </IconButton>
          </label>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Title sx={iconStyles} />
          <Box sx={{ flex: 1, position: "relative" }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
              size={isSmallScreen ? "small" : "medium"}
              disabled={isLoading}
              sx={textFieldStyles}
            />
            <Tooltip title="Generate title with AI">
              <IconButton
                onClick={() => generateAIContent("title")}
                disabled={isGenerating || isLoading}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh
                    sx={{
                      color: "yellow",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Description sx={iconStyles} />
          <Box sx={{ flex: 1, position: "relative" }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={isSmallScreen ? 4 : 10}
              variant="outlined"
              disabled={isLoading}
              sx={textFieldStyles}
            />
            <Tooltip title="Generate description with AI">
              <IconButton
                onClick={() => generateAIContent("description")}
                disabled={isGenerating || isLoading}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: isSmallScreen ? 8 : 16,
                }}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh
                    sx={{
                      color: "yellow",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Category sx={categoryIconStyles} />
          <FormControl
            fullWidth
            required
            disabled={isLoading || categories.length === 0}
            sx={selectStyles}
          >
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
              size={isSmallScreen ? "small" : "medium"}
              sx={{
                color: "#ffffff",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem
                  key={cat._id || cat}
                  value={cat._id || cat}
                  sx={menuItemStyles}
                >
                  {cat.name || cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size={isSmallScreen ? "medium" : "large"}
            sx={submitButtonStyles}
            disabled={isLoading || isGenerating}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default BlogForm;

// Page loads
// useEffect → dispatch(fetchCategories())

// 👉 categories fetched

// 2. User types input
// handleChange → updates formData
// 3. User clicks AI
// generateAIContent()

// 👉 AI fills title/description

// 4. User selects image
// handleImageChange()

// 👉 preview shown

// 5. User submits form
// handleSubmit()
// 6. Inside submit:
// Step 1: validate
// Step 2: upload image → Cloudinary
// Step 3: dispatch Redux thunk
// createBlogPost()
// 7. Redux flow
// dispatch(createBlogPost)
//    ↓
// pending → loading true
//    ↓
// fulfilled → post added
//    ↓
// UI updates