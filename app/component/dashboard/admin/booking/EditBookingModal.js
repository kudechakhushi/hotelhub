"use client";
import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BookingDetails from "./BookingDetails";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 1200,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  overflowY: "auto",
  p: 2,
};

const EditBookingModal = ({ booking, open, onClose, onSave }) => {
  const [editedBooking, setEditedBooking] = useState(booking);
//   You are creating a copy of booking
  useEffect(() => {
    setEditedBooking(booking);
  }, [booking]);
//   When parent sends a NEW booking:
//   → update local state

  const handleFieldChange = (updatedBooking) => {
    setEditedBooking(updatedBooking);
  };
//   replace local state with new version
  const handleSave = () => {
    onSave(editedBooking);
    onClose();
    // Send updated booking to parent
// Close modal
  };

  const handleClose = () => {
    onClose();
    setEditedBooking(booking);
    // Close modal
// Reset state
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>



        {editedBooking && (
          <BookingDetails
            booking={editedBooking}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            onCancel={handleClose}
          />
        )}
      </Box>
    </Modal>
  );
};

export default EditBookingModal;