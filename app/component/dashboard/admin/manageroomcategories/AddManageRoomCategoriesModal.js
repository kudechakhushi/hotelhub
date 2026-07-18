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
import { modalStyle } from "./styles";

export default function AddManageRoomCategoriesModal({
  open,
  onClose,
  onSuccess,
  loading,
  setLoading,
}) {
  const [newroomtype, setNewRoomType] = useState({
    name: "",
  });
//   Holds form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // name → field name
    // value → user input
    setNewRoomType((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Updates state dynamically
  };

  const handleAddRoomType = async () => {
    // Triggered when user clicks Add
    if (!newroomtype.name) {
      toast.error("Please fill all required  fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/roomtype`, {
        // Calls your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: newroomtype.name,
        }),
      });

      const data = await response.json();
    //   Backend response
      onSuccess(data);
    //   Sends data back to parent
      toast.success("New Room Type Added successfully");

      setNewRoomType({
        name: "",
      });
    //   Clears input field
    } catch (error) {
      toast.error("Failed to add  new room type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-team-modal">
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
          Add New RoomType
        </h2>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newroomtype.name}
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
              onClick={handleAddRoomType}
              sx={{
                backgroundColor: "#8A12FC",
                "&:hover": { backgroundColor: "#7a0eeb" },
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

// Click Button
//    ↓
// setOpenAddModal(true)
//    ↓
// Modal opens

// User types name
//    ↓
// State updates

// Click "Add Member"
//    ↓
// handleAddRoomType()

//    ↓
// POST /api/admin/roomtype

//    ↓
// Backend:
//    - Create RoomType
//    - Create Room (linked)

//    ↓
// Response sent back

//    ↓
// onSuccess(data)

//    ↓
// handleAddSuccess()

//    ↓
// Update UI state
//    ↓
// Close modal