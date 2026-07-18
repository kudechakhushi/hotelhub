import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast } from "react-toastify";

import { textFieldStyles } from "./styles";

const RoomNumbersTable = ({
  setEditedMember,
  editedMember,
  handleInputChange,
  handleAddRoomNumberSubmit,
//   editedMember → all data
// setEditedMember → update state
// handleInputChange → form handling
// handleAddRoomNumberSubmit → API call
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  // holds the room currently being edited
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [roomToDelete, setRoomToDelete] = useState(null);

  const handleOpenEditModal = (room) => {
    setCurrentRoom(room);
    // Stores the clicked room in state
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    // Closes modal
    setCurrentRoom(null);
    // Clears the current room data
  };

  const handleSaveRoom = async () => {
    const response = await fetch(
      `/api/admin/room/roomno/${currentRoom._id}`,
      // Calls backend using room ID
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Sending JSON data
        },
        body: JSON.stringify(currentRoom),
        // Sending JSON data
      }
    );
    // This is an array of room objects
    const updatedRooms = editedMember.room_numbers.map((room) =>
      // Loop through every room to return new array
      room._id === currentRoom._id ? currentRoom : room
//       Compare IDs
// If TRUE → this is the room being edited
// If FALSE → not the one
    );
//     IF this room is the edited one
//   → replace it with updated version (currentRoom)
// ELSE
//   → keep original room

    setEditedMember({
      ...editedMember,
      // It copies all existing properties from editedMember.
      room_numbers: updatedRooms,
      // This overwrites only the room_numbers field.
    });

    toast.success("room no  updated successfully");

    handleCloseEditModal();
  };

  const handleRoomChange = (e) => {
    setCurrentRoom({
      // Replace currentRoom with a new updated object”
      ...currentRoom,
      // Spread operator → copies all existing data.
      [e.target.name]: e.target.value,
      // e.target.name Comes from your input field:
      // e.target.value What user typed.
    });
  };

  const handleOpenDeleteConfirm = (room) => {
    // Function takes a room object as input
    setRoomToDelete(room);
    // Saves the selected room into state.
    setDeleteConfirmOpen(true);
    // Opens the confirmation modal (popup).
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setRoomToDelete(null);
//     setDeleteConfirmOpen(false);
// → Closes the modal.
// setRoomToDelete(null);
// → Clears the selected room.
  };

  const handleConfirmDelete = async () => {
    const resposne = await fetch(
      `/api/admin/room/roomno/${roomToDelete?._id}`,
      {
        method: "DELETE",
      }
    );

    const updatedRooms = editedMember.room_numbers.filter(
      (room) => room._id !== roomToDelete._id
    );
    // Goes through all roomsRemoves the deleted one
//     editedMember.room_numbers
// → Array of all rooms
// .filter(...)
// → Keeps only rooms that are NOT deleted
// room._id !== roomToDelete._id
// → Removes the matching room
    setEditedMember({
      ...editedMember,
      room_numbers: updatedRooms,
//       ...editedMember
// → Keeps everything else the same
// room_numbers: updatedRooms
// → Replaces old rooms with new filtered list
    });
      handleCloseDeleteConfirm();
      // Closes modal and resets state
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editedMember.room_numbers?.map((room) => (
              // editedMember.room_numbers
              // Loops through each room
              // Creates a row for each
              <TableRow key={room._id || room.roomNumber}>
                <TableCell>{room.room_no}</TableCell>
                <TableCell>
                  {room.status === 1 ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditModal(room)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteConfirm(room)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Room Modal */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit Room</h2>

          {currentRoom && (
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Room Number"
                name="room_no"
                value={currentRoom.room_no || ""}
                onChange={handleRoomChange}
                variant="outlined"
                size="small"
                {...textFieldStyles} // Spread the styles here
              />

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentRoom.status || 0}
                  onChange={handleRoomChange}
                  label="Status"
                >
                  <MenuItem value={0}>Inactive</MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={handleCloseEditModal} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSaveRoom}>
                  Save
                </Button>
              </Box>
            </Stack>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Confirm Delete</h2>
          <p>
            Are you sure you want to delete room {roomToDelete?.roomNumber}?
          </p>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseDeleteConfirm} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add New Room Section */}
      <Box sx={{ mt: 3 }}>
        <h3>Add New Room Number</h3>
        <input
          type="hidden"
          name="room_id"
          value={editedMember.room_id || ""}
        />
        <input
          type="hidden"
          name="room_type_id"
          value={editedMember.roomtype_id || ""}
        />
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Room Number"
            name="roomNumber"
            value={editedMember.roomNumber}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            {...textFieldStyles} // Spread the styles here
          />
        </Stack>

        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={editedMember.status}
            onChange={handleInputChange}
            label="Status"
          >
            <MenuItem value={0}>Inactive</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => {
            if (editedMember.roomNumber) {
              // editedMember.room_numbers has rooms
              const newRoom = {
                _id: Date.now().toString(), // temporary ID
                roomNumber: editedMember.roomNumber,
                status: editedMember.status,
              };

              setEditedMember({
                ...editedMember,
                room_numbers: [...(editedMember.room_numbers || []), newRoom],
                roomNumber: "",
                status: 0,
              });

              handleAddRoomNumberSubmit();
            }
          }}
        >
          Add Room
        </Button>
      </Box>
    </div>
  );
};

export default RoomNumbersTable;

// DATA (room_numbers)
//    ↓
// TABLE (map → render rows)
//    ↓
// USER ACTION
//    ↓
// MODAL (edit/delete/add)
//    ↓
// STATE UPDATE (setEditedMember)
//    ↓
// RE-RENDER TABLE