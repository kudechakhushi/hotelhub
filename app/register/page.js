"use client";
// Forces this component to run in browser (not server)

// Without this:

// useState ❌ won’t work
// event handlers ❌ won’t work
import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Link,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import HotelHubLogo from "../component/nav/HotelHubLogo";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

// MUI automatically creates DOM like:

// <div class="MuiOutlinedInput-root">

// 👉 This is the actual input wrapper
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "red" },
    "&:hover fieldset": { borderColor: "red" },
    "&.Mui-focused fieldset": { borderColor: "red" },
  },
  "& .MuiInputLabel-root": { color: "red" },
  "& .MuiInputBase-input": { color: "black" },
};

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
 const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };
//     async means:
// “This function will deal with operations that take time (like API calls).”
  const handleRegister = async (e) => {
//     Stops page reload
// //  Lets React control everything
    e.preventDefault();

    if (!name || !phone || !email || !password) {
      setSnackbarMessage("All fields are required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
   

    if (!/^\d{10}$/.test(phone)) {
      setSnackbarMessage("Enter valid 10-digit phone");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbarMessage("Invalid email");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      // 
      // await is used to wait for a Promise to finish before moving to the next line
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });

      if (res.ok) {
        setSnackbarMessage("Registration successful");
        setSnackbarSeverity("success");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      } else {
        const data = await res.json();
        // Read error message from backend
        setSnackbarMessage(data.message || "Failed");
        setSnackbarSeverity("error");
      }
    } catch {
      setSnackbarMessage("Something went wrong");
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
  };

  return (
     <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Registration Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "background.paper",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Box
        onSubmit={handleRegister}
          component="form"
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              ml: "5px", // Your left margin
            }}
          >
           <Box sx={{ display: "flex", justifyContent: "center" }}>
  <HotelHubLogo />
</Box>
          </Box>

          <Typography variant="h4" gutterBottom align="center">
            Register
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}

            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <Divider>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
              py: 1.5,
            }}
            onClick={() => signIn("google")}
          >
            Log In with Google
          </Button>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
              py: 1.5,
            }}
          >
            Register
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/login" underline="hover">
              Already have an account? Login
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Image (Hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "50%",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/images/register.jpeg"
          alt="Register"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      {/* Snackbar = user notification UI */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  
  );
};

export default RegisterPage;