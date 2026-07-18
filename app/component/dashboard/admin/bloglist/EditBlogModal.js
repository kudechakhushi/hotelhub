import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { Save, Cancel, UploadFile } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateBlogPost } from "@/slice/blogSlice";
// useDispatch() → send actions
// updateBlogPost → async thunk to update post

const EditBlogModal = ({ open, onClose, post }) => {
  const dispatch = useDispatch();
  // Required to trigger update API
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
  });
  // Stores form values
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [uploading, setUploading] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      // Runs when post changes
      setFormData({
        title: post.title,
        slug: post.slug,
        description: post.description,
        image: post.image,
      });
      // Pre-fills form with existing data

      setImagePreview(post.image);
      // Show existing image
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Extract field name + value
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Dynamically updates field
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    // Get selected file  
    if (file) {
      setImageFile(file);
      // Stores file in state
      const reader = new FileReader();
      // Browser API to read file content
      reader.onloadend = () => {

        setImagePreview(reader.result);
        // When reading finishes:
// reader.result = base64 string
      };

      reader.readAsDataURL(file);
      // Converts file → base64 string
      setUploading(true);

      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        // Calls your upload function
        setFormData((prev) => ({
          ...prev,
          image: uploadedUrl,
          // Updates form with real hosted image URL
        }));
      } catch (error) {
        setError("image upload faield");
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    // Required for file upload
    formData.append("file", imageFile);
    // Attach file
    formData.append("upload_preset", "ml_default");
    // Cloudinary config

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      // Sends POST request to Cloudinary
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      console.log("imag  response", response);
      const data = await response.json();
      // Parse response
      return data.secure_url;
      // Returns hosted image URL
    } catch (error) {
      console.log("error uploading image", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Stops page reload
    setLoading(true);
    setError(null);

    try {
      await dispatch(updateBlogPost({ id: post?._id, ...formData })).unwrap();
      // Sends update request id: post?._id → which blog to update
// ...formData → new values
// .unwrap() → throws error if failed
      setLoading(false);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to update blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Blog Post</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Post Image
            </Typography>
            {imagePreview && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFile />}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} startIcon={<Cancel />} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading || uploading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditBlogModal;

// Modal opens
// post passed in
// useEffect fills form
// 2. User edits fields
// handleChange updates state
// 3. User uploads image
// preview shown instantly
// file uploaded to Cloudinary
// URL stored in formData.image
// 4. User clicks Save
// handleSubmit runs
// API call via Redux
// if success → modal closes
// if error → alert shown