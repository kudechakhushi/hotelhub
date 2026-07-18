// Click Button → open modal → fill form → upload image → call API → update UI → close modal
import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Stack,
  Input,
  Button,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { modalStyle } from "./style";

export default function AddTeamModal({
  open,
  onClose,
  onSuccess,
  loading,
  setLoading,
}) {
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    image: null,
    previewImage: "",
  });
  // Stores form data as state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // input name="name"
// → updates newMember.name
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    // When you choose a file:Browser gives you that file objecIt’s NOT uploaded yet

    if (file) {
      const reader = new FileReader();
      // This is a browser tool that: Reads files (image, pdf, etc.)
      reader.onloadend = () => {
        setNewMember((prev) => ({
          ...prev,
          image: file,
          previewImage: reader.result,
          // image	actual file (for upload)
// previewImage	base64 string (for UI)
          // This shows image in UI
        }));
      };

      reader.readAsDataURL(file);
      // Converts image → base64
// Used for preview
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.position) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      if (newMember.image) {
        const imageData = new FormData();
        imageData.append("file", newMember.image);
        imageData.append("upload_preset", "ml_default");
        // FormData = special format for files Required for file upload
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: imageData,
          }
        );
        // This sends:
        // file, preset upload_preset
        // to Cloudinary server
        const data = await response.json();

        imageUrl = data.secure_url;
        // Now you have permanent hosted image
      }

      const response = await fetch(`/api/admin/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMember.name,
          position: newMember.position,
          image: imageUrl,
            // You are NOT storing file
      // You are storing URL
        }),
      });
    
      const data = await response.json();

      onSuccess(data);
      // Parent updates employee list
      toast.success("Team member added successfully");

      setNewMember({
        name: "",
        position: "",
        image: null,
        previewImage: "",
      });
      // Reset form
    } catch (error) {
      console.log("error adding team", error);

      toast.error("Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-team-modal">
      {/* open = true → modal visible */}
      {/* open = false → hidden */}
      <Box sx={modalStyle}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "#1a202c",
          }}
        >
          Add New Team Member
        </h2>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newMember.name}
            onChange={handleInputChange} // Updates state when user types
            variant="outlined"
            disabled={loading}
            slotProps={{
              inputLabel: {
                sx: { color: "#8A12FC" },
              },
            }}
            sx={{
              input: { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Position"
            name="position"
            value={newMember.position}
            onChange={handleInputChange}
            variant="outlined"
            disabled={loading}
            slotProps={{
              inputLabel: {
                sx: { color: "#8A12FC" },
              },
            }}
            sx={{
              input: { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <Box>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="add-image-upload"
              sx={{ display: "none" }}
              disabled={loading}
            />
            <label htmlFor="add-image-upload">
              <Button
                variant="contained"
                component="span"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#8A12FC",
                  "&:hover": { backgroundColor: "#7a0eeb" },
                }}
              >
                Upload Image
              </Button>
            </label>
            {/* if (previewImage exists) → show image */}
            {newMember.previewImage && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={newMember.previewImage}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    border: "3px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: "12px" }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddMember}
              sx={{
                backgroundColor: "#8A12FC",
                "&:hover": { backgroundColor: "#7a0eeb" },
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
              {/* Dynamic text */}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
// 1. Click "Add Team Member"
// 2. openAddModal = true
// 3. Modal appears
// 4. Fill form
// 5. Upload image → preview shown
// 6. Click "Add Member"
// 7. Upload image → Cloudinary
// 8. Send data → /api/admin/team
// 9. API saves in DB
// 10. Response returned
// 11. onSuccess() called
// 12. Parent updates employees list
// 13. Modal closes
// 14. Toast shown
// HOW IMAGE PREVIEW WORKS
// 1. newMember.image = file object
// 2. newMember.previewImage = base64 string
// 3. UI shows preview
// 4. When user clicks "Add Member":
// 5. newMember.image = file object
// 6. newMember.previewImage = base64 string
// 7. UI shows preview
// // reader.readAsDataURL(file); This converts image → base64 string
// HOW IMAGE UPLOAD TO CLOUDINARY WORKS
// 1. User selects image
// 2. FileReader converts → base64
// 3. Preview shows instantly
//    ❌ not uploaded yet

// 4. User clicks "Add Member"
// 5. Image sent to Cloudinary
// 6. Cloudinary returns URL
// 7. URL saved in DB
// 8. UI shows real image from URL