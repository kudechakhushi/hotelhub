"use client";
// this is admin dashboard book area section
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function PromoCardEditor() {
  const [form, setForm] = useState({
    shortTitle: "",
    mainTital: "",

    shortDesc: "",
    linkUrl: "",
    photo: null,
    existingPhotoUrl: "",
  });
  // This is your entire form data container.
  const [imagePreview, setImagePreview] = useState("");
  // Stores preview image (base64 or URL)
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    text: "",
    isError: false,
  });
  // Stores success/error messages
  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/bookarea`);
        // Fetches data from API route

        if (!response.ok) {
          throw new Error("Faile to fetch promo data");
        }

        const data = await response.json();
        // Convert response to JSON
        if (data) {
          setForm({
            shortTitle: data?.shortTitle || "",

            mainTital: data?.mainTital || "",
            shortDesc: data?.shortDesc || "",
            linkUrl: data?.linkUrl || "",
            photo: null,
            existingPhotoUrl: data?.photoUrl || "",
          });
          // This fills form with DB data
          if (data?.photoUrl) {
            setImagePreview(data?.photoUrl);
            // Shows existing image
          }
        }
      } catch (error) {
        console.log("error fetching promo data", error);
        setServerMessage({ text: "Failed to load promo data", isError: true });
      } finally {
        setIsLoading(false);
      }
    };


    fetchPromoData()
  }, []);

  const handleChange = (e) => {
    // It runs every time the user types in the input field.
    const { name, value } = e.target;
    // name → which field it is (shortTitle)  value → what user typed e.target = the input field (TextField)
    setForm((prev) => ({ ...prev, [name]: value }));
    // { ...prev }
// Copy old data (so you don’t lose other fields)
// [name]: value
// Dynamically update only ONE field
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    // files = array of selected files
    // [0] = first file
    if (file) {
      setForm((prev) => ({ ...prev, photo: file }));
      // You’re just storing the file in memory.
      const reader = new FileReader();
      // Browser tool to read file content
      reader.onloadend = () => {
        // reader.result = base64 string of image
        setImagePreview(reader.result);
        // Shows preview image
      };
      reader.readAsDataURL(file);
      // Reads the file and converts it to a base64 string
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    // Required for file upload

    formData.append("file", imageFile);
    // Cloudinary expects key = "file"
    formData.append("upload_preset", "ml_default");
    // This comes from Cloudinary settings

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        // Cloudinary API endpoint
        {
          method: "POST",
          body: formData,
          // Sends file to Cloudinary servers
        }
      );

      console.log(response);
      if (!response.ok) {
        throw new Error("failed to upload image to cloudinary");
      }

      const data = await response.json();
      console.log(data);
      return data?.secure_url;
    } catch (error) {
      console.log("cloudinary upload error", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    setServerMessage({ text: "", isError: false });

    try {
      let imageUrl = form.existingPhotoUrl;
      // If user did NOT upload new image
// Keep old image
      if (form.photo) {
        imageUrl = await uploadImageToCloudinary(form.photo);
//         Critical logic:

// 👉 Case 1: user DID NOT change image
// → skip upload
// → use old image

// 👉 Case 2: user selected new image
// → upload to Cloudinary
// → get new URL
      }

      const requestBody = {
        shortTitle: form.shortTitle,
        mainTital: form.mainTital,
        shortDesc: form.shortDesc,
        linkUrl: form.linkUrl,
        photoUrl: imageUrl,
      };

      const response = await fetch(`/api/admin/bookarea`, {
        method: "PUT",
        // Sends request to API route to update data in database
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || " failed to save promo");
      }

      const result = await response.json();

      setServerMessage({
        text: result.message || " Promo updated successdully",
        isError: false,
      });

      setForm((prev) => ({
        ...prev,
        existingPhotoUrl: imageUrl,
        photo: null,
      }));
      // Save new image URL as “existing”
    } catch (error) {
      setServerMessage({
        text: error.message || "an error occured while saving",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Typography variant="h6" mb={2}>
        Snap Booking
      </Typography>

      {serverMessage.text && (
        <Alert
          severity={serverMessage.isError ? "error" : "success"}
          // true → red alert
// false → green alert
          sx={{ mb: 2 }}
        >
          {serverMessage.text}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          name="shortTitle"
          label="Short Title"
          value={form.shortTitle}
          onChange={handleChange}
          // value={form.shortTitle} → controlled input
// onChange={handleChange} → updates state
// User types
// handleChange runs
// Updates form.shortTitle
// UI re-renders
          fullWidth
          slotProps={{
            inputLabel: {
            sx: { color: "#8A12FC" },
            },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              // normal border
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                // hover border
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                // focused border
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <TextField
          name="mainTital"
          label="Main Title"
          value={form.mainTital}
          onChange={handleChange}
          fullWidth
          slotProps={{
            inputLabel: {
            sx: { color: "#8A12FC" },
            },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <TextField
          name="shortDesc"
          label="Short Description"
          value={form.shortDesc}
          onChange={handleChange}
          rows={5}
          fullWidth
          slotProps={{
            inputLabel: {
            sx: { color: "#8A12FC" },
            },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <TextField
          name="linkUrl"
          label="Link URL"
          value={form.linkUrl}
          onChange={handleChange}
          fullWidth
          slotProps={{
            inputLabel: {
            sx: { color: "#8A12FC" },
            },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />

        {/* Image preview */}
        {/* Only shows if image exists */}
        {imagePreview && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Image Preview:
            </Typography>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          component="label"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#8A12FC",
            "&:hover": {
              backgroundColor: "#7a0ae8",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        >
         {/* User clicks button
Actually triggers hidden input
File picker opens
User selects file
 handleFileChange runs */}
          {imagePreview ? "Change Photo" : "Upload Photo"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#8A12FC",
            "&:hover": {
              backgroundColor: "#7a0ae8",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Snap Booking"
          )}
        </Button>
      </Stack>
    </Box>
  );
}
