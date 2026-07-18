import React, { useState, useEffect } from "react";
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

export default function EditTeamModal({
  open,
  onClose,
  member,
  onSuccess,
  loading,
  setLoading,
})
// open → controls modal visibility
// member → passes selected employee
// onSuccess → callback after update
 {
  const [editedMember, setEditedMember] = useState({
    name: "",
    position: "",
    image: null,
    previewImage: "",
  });
  // ou NEVER edit member directly
  // 👉 You copy it → modify locally
  useEffect(() => {
    if (member) {
      setEditedMember({
        name: member.name,
        position: member.position,
        image: null,
        previewImage: member.image,
      });
    }
  }, [member]);
//   When you click Edit: Parent sends member member changes useEffect runs
// form gets filled
  // it copies data from member → into local state So your form fields are pre-filled.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Same as:  const name = e.target.name;
    // const value = e.target.value;
    setEditedMember((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Take old stateUpdate ONLY the field that changed
// Keep everything else same
  };
  // updates state LIVE when user types
  // keeps everything controlled
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    // User selects file
    if (file) {
      const reader = new FileReader();
      // Converts file → base64
      reader.onloadend = () => {
        setEditedMember((prev) => ({
          ...prev,
          image: file,
          previewImage: reader.result,
          // previewImage shows the image in the form
        }));
      };

      reader.readAsDataURL(file);
      // Reads file → sets previewImage
    }
  };

  const handleUpdateMember = async () => {
    if (!editedMember.name || !editedMember.position) {
      toast.error("Please fil all required fields");
    }

    try {
      setLoading(true);

      let imageUrl = member.image;
      // Default = old image
      if (editedMember.image && typeof editedMember.image !== "string") {
        // user selected new image
        const imageData = new FormData();

        imageData.append("file", editedMember.image);
        imageData.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: imageData,
          }
        );
        // Upload to Cloudinary
        const data = await response.json();

        imageUrl = data.secure_url;
        // Now you get final image URL
      }

      const response = await fetch(
        `/api/admin/team/${member._id}`,
        // This hits your backend:
// PUT /api/admin/team/:id
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedMember.name,
            position: editedMember.position,
            image: imageUrl,
          }),
        }
      );

      const updatedEmployee = await response.json();

      onSuccess(updatedEmployee);
      // This triggers the parent callback handleEditSuccess is team.js
      toast.success("Team member updated successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-team-modal">
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
          Edit Team Member
        </h2>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editedMember.name}
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

          <TextField
            fullWidth
            label="Position"
            name="position"
            value={editedMember.position}
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
              id="edit-image-upload"
              sx={{ display: "none" }}
              disabled={loading}
            />
            <label htmlFor="edit-image-upload">
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
                Change Image
              </Button>
            </label>
            {(editedMember.previewImage || member?.image) && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={editedMember.previewImage || member?.image}
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
              onClick={handleUpdateMember}
              sx={{
                backgroundColor: "#8A12FC",
                "&:hover": { backgroundColor: "#7a0eeb" },
              }}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Member"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
  
}
// What this component actually is
// 1. Receive selected member
// 2. Show existing data
// 3. Let user modify it
// 4. Send update to backend + update UI
// Click Edit
// → Open modal
// → Fill form (local state)
// → Click Update
// → Upload image (optional)
// → Send PUT request
// → Update DB
// → Update frontend state
// → UI refreshes automatically
// Click Edit
// → setCurrentMember
// → open modal

// Modal loads member into state

// User edits fields

// Click Update
// → validate
// → upload image (optional)
// → PUT API call

// Backend updates DB

// Frontend:
// → replaces item in state
// → re-renders UI
// → closes modal