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

export default function DeleteTeamModal({
  open,
  onClose,
  member,
  onSuccess,
  loading,
  setLoading,
})
// open → controls whether modal is visible
// onClose → function to close modal
// member → the employee object you want to delete
// onSuccess → callback AFTER delete (important for UI update)
// loading → boolean (button disable + "Deleting...")
// setLoading → function to control loading state
 {
  const handleDelete = async () => {
    try {
      setLoading(true);
      // UI reaction: buttons disabled
      // disables buttons
      await fetch(`/api/admin/team/${member._id}`, {
        // Calls backend API Backend should:find record by _id and delete from database
        method: "DELETE",
      });

      onSuccess(member._id);
      // Delete is done → now YOU update your list” "Backend done → now update UI"
// This triggers:setEmployees(prev => prev.filter(...))
      toast.success("Team memebr deleted successfully");
    } catch (error) {
      toast.error("Failed to  delete Team Member");
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
          {/* ?. Prevent crash if member is null */}
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
          autoFocus
        >
          {loading ? "Deleting..." : "Delete"}
          {/* changes text while request is running */}
        </Button>
      </DialogActions>
    </Dialog>
  );
}