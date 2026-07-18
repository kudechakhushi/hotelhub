"use client";

// components/ChangePasswordForm.js
import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Box,
} from "@mui/material";
import BeatLoader from "react-spinners/BeatLoader";
const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Stop page reload
    console.log({ oldPassword, newPassword });

    if (newPassword !== confirmPassword) {
      setAlert({
        type: "error",
        message: "new password  do not match",
      });
      // Error shown instantly
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/user/change/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // You’re sending JSON data
        },
        body: JSON.stringify({ oldPassword, newPassword }),
        // Data sent to backend:
      });

      const data = await response.json();
      // Backend sends:

      // success → { msg: ... }
      // error → { err: ... }
      if (response.ok) {
        setLoading(false);

        setAlert({
          type: "success",
          message: "password  change successfully",
        });

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setLoading(false);
        setAlert({
          type: "error",
          message: data?.err,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "something went wrong",
      });
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Box
        sx={{ width: "100%", padding: "2rem", boxShadow: 9, borderRadius: 1 }}
      >
        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Change Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            slotProps={{
              inputLabel: {
                sx: { color: "#8A12FC" },
              },
            }}
            sx={{
              mb: 3,
              input: { color: "#8A12FC" },
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
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            slotProps={{
              inputLabel: {
                sx: { color: "#8A12FC" },
              },
            }}
            sx={{
              mb: 3,
              input: { color: "#8A12FC" },
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
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            slotProps={{
              inputLabel: {
                sx: { color: "#8A12FC" },
              },
            }}
            sx={{
              mb: 3,
              input: { color: "#8A12FC" },
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#8A12FC",
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC",
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC",
                  backgroundColor: "#8A12FC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC",
                },
              },
            }}
          >
            <BeatLoader
              color="white"
              loading={loading}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />

            {loading ? "" : "change password"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePasswordForm;

// User opens form → enters passwords
// Clicks “Change Password”
// handleSubmit runs
// Frontend validates passwords
// Sends request to backend API
// Backend verifies user + old password
// Backend updates password
// Response comes back
// UI updates (success/error)
// Frontend:
// User → Form → handleSubmit → fetch API
// Backend:
// API receives → checks session → verifies old password → hashes new → saves
// Response:
// Success OR Error → Frontend shows alert