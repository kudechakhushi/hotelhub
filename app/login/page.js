"use client";

import React, { useState } from "react";
import {
  Divider,
  TextField,
  Button,
  Link,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { signIn } from "next-auth/react";
// This function:
// sends login request to NextAuth
// triggers credentials OR Google login
import HotelHubLogo from "@/app/component/nav/HotelHubLogo";
import { useRouter } from "next/navigation";
// Used for navigation:router.push("/")
import GoogleIcon from "@mui/icons-material/Google";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "red" },
    "&:hover fieldset": { borderColor: "red" },
    "&.Mui-focused fieldset": { borderColor: "red" },
  },
  "& .MuiInputLabel-root": { color: "red" },
  "& .MuiInputBase-input": { color: "black" },
};

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isEmail, setIsEmail] = useState(true);
//   Tracks input type:true → email
// false → phone

  const router = useRouter();
  // used to redirect after login 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatedPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };
  // Runs when form is submitted
  const handleLogin = async (e) => {
    e.preventDefault();
    // Stops page reload
    const isInputEmail = validateEmail(loginId);
    const isInputPhone = validatedPhone(loginId);

    if (!loginId || !password) {
      setSnackbarMessage("Login Id and Password are required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!isInputEmail && !isInputPhone) {
      setSnackbarMessage("Please enter a valid email or phone number");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      // It sends request to:/api/auth/[...nextauth]
      const result = await signIn("credentials", {
        redirect: false,
        [isInputEmail ? "email" : "phone"]: loginId,
        password,
      });

      if (result?.error) {
        setSnackbarMessage(result.error || "Login failed");
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage("Login successful");
        setSnackbarSeverity("success");
        router.push("/");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again");
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLoginIdChange = (e) => {
    const value = e.target.value;
    setLoginId(value);

    if (value.includes("@")) {
      setIsEmail(true);
    } else if (/^[0-9]+$/.test(value)) {
      setIsEmail(false);
    }
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
      {/* Left Side - Login Form */}
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
          component="form"
          onSubmit={handleLogin}
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <HotelHubLogo />
          </Box>

          <Typography variant="h4" gutterBottom align="center">
            Login
          </Typography>

          <TextField
            label={isEmail ? "Email" : "Phone Number"}
            // Changes keyboard/input type
            type={isEmail ? "email" : "tel"}
            variant="outlined"
            fullWidth
            value={loginId}
            onChange={handleLoginIdChange}
            sx={inputStyle}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
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
            // Starts OAuth flow This:redirects to Google
          >
            Log In with Google
          </Button>

          <Link
            href="/forgot-password"
            variant="body2"
            sx={{ alignSelf: "flex-end", mt: 1 }}
          >
            Forgot Password?
          </Link>

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
            Login
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/register" underline="hover">
              Don&apos;t have an account? Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Image (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "50%",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/images/login5.jpg"
          alt="Login image"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;