import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

export default function DeleteManageRoomCategoriesModal({
  open,
  onClose,
  member,
  onSuccess,
  loading,
  setLoading,
//   open → controls whether modal is visible (true/false)
// onClose → function to close modal
// member → data of the room type (object)
// onSuccess → callback after delete (usually to update UI)
// loading → boolean for loading state
// setLoading → function to update loading state
}) {
  const handleDelete = async () => {
    // Function that runs when user clicks Delete button
// async because API call is involved
if (!member?._id) {
  toast.error("No room type selected");
  return;
}
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/roomtype/${member._id}`,
        // API call to delete room type
// Uses member._id → dynamic ID in URL
        {
          method: "DELETE",
        }
      );

      onSuccess(member._id);
      // Calls parent function after delete
      toast.success("room type delete successfully");
    } catch (error) {
      toast.error("faield to delete room type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {member?.name}? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          // Disabled while deleting
          autoFocus
          // Focused by default when modal opens
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// User clicks delete button

// handleDeleteClick(room)
// State updates:
// roomMember = selected room
// openDeleteModal = true
// Modal opens
// User clicks Delete
// handleDelete() in modal runs
// API call happens
// On success:

// Modal calls:

// onSuccess()

// Parent runs:

// fetchroomtype();
// setOpenDeleteModal(false);
// UI updates with fresh data