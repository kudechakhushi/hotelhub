"use client"; // Ensure this is at the top for Next.js to handle the client-side component

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

// List of countries for the dropdown
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  // Add more countries as needed
];

export default function ProfileUpdateForm() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");

  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [serverMessage, setServerMessage] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/profile`);
      // Calls backend get api
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      // Parse JSON
      setEmail(data?.email || "");
      setName(data?.name || "");
      setMobileNumber(data?.mobileNumber || "");
      setAddress(data?.address || "");
      setCountry(data?.country || "");  // never undefined
    //  setProfileImagePreview(data?.image || "");
    } catch (error) {
      console.log("error fetching user data", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name) errors.name = "name is required";

    if (!email) errors.email = "email is required";

    if (mobileNumber && !/^[0-9]{10}$/.test(mobileNumber)) {
      errors.mobileNumber = " please enter a valid 10  digit mobile number";
    }

    if (address && address.length < 5) {
      errors.address = "address is too  short";
    }

    if (
      country &&
      // Only run validation if user has selected something
      // .some() = checks if at least one item matches
      !countries.some((c) => c.code === country || c.name === country)
      // c.code === country → matches "IN"
      // c.name === country → matches "India"
    ) {
      errors.country = "please select  a valid country";
    }

    if (!password) errors.password = "password  is required";

    if (password !== confirmPassword) {
      errors.confirmPassword = " password  do not match";
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
    // Return true if there are NO errors, otherwise false"
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // Get uploaded file
    if (file) {
      setProfileImage(file);
      // Stores actual file in state
      const reader = new FileReader();
      // Browser API to read file content
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        // reader.result = base64 string of image
      };
      reader.readAsDataURL(file);
      // Converts file → base64 string
    }
  };
//   User selects image
// Save file in state
// Convert to base64
// Show preview
  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    // Special object for sending files via HTTP
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");
    // Cloudinary config
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

// Sends POST request to Cloudinary API
    const data = await response.json();
    // Convert response into JSON
    return data.secure_url;
  };

//   User selects file
// Preview shown (base64)
// On submit → file sent to Cloudinary
// Cloudinary returns URL
// You save URL in database
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Stops default form behavior
    setServerMessage("");
    if (!validateForm()) return;
    // If invalid → stop execution
    let imageUrl = null;

    if (profileImage) {
      imageUrl = await uploadImageToCloudinary(profileImage);
      // Upload image to Cloudinary and get URL.
      setIsSuccess(true);
      setServerMessage("image uploaded successfully");
    }

    const requestBody = {
      name,
      email,
      password,
      mobileNumber,
      address,
      country,
      profileImage: imageUrl,
    };
    // Object sent to backend
    const response = await fetch(`/api/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Tells server you're sending JSON.
      },
      body: JSON.stringify(requestBody),
      // Converts object → JSON string.
    });

    const data = await response.json();
    // Response Handling
    if (!response.ok) {
      setIsSuccess(false);
      setServerMessage(data?.err);
    } else {
      setIsSuccess(true);
      setServerMessage(data?.msg);
     if (imageUrl) setProfileImagePreview(imageUrl); // Cloudinary URL
      setProfileImage(null);
      setPassword("");
      setProfileImagePreview(""); 
      setConfirmPassword("");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          maxWidth: 1300,
          margin: "0 auto",
          padding: 2,
          overflow: "hidden",
          //  backgroundColor: "rgba(31, 15, 15, 0.6)",
          marginTop: "29px",
          padding: "40px",
          color: "white",
        }}
      >
        {profileImagePreview && (
          <Box
            sx={{
              order: { xs: 2, sm: 1 },
              flex: { xs: "none", sm: 1 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {profileImagePreview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <div className="image-container">
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="profile-image"
                  />
                </div>
              </Box>
            )}
          </Box>
        )}

        <Box
          sx={{
            order: { xs: 1, sm: 2 },
            flex: { xs: 1, sm: 2 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "#8A12FC",
            }}
            variant="h4"
            component="h1"
            gutterBottom
          >
            Update Profile
          </Typography>
          {serverMessage && (
            <Alert severity={isSuccess ? "success" : "error"}>
              {serverMessage}
            </Alert>
          )}
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
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
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
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
            label="Mobile Number"
            variant="outlined"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            fullWidth
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
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            multiline
            rows={3}
            slotProps={{
              inputLabel: {
                sx: { color: "#8A12FC" },
              },
            }}
            sx={{
              mb: 3,
              textarea: { color: "#8A12FC" },
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="country-select-label" sx={{ color: "black" }}>
              Country
            </InputLabel>
            <Select
              labelId="country-select-label"
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              error={!!errors.country}
              sx={{
                color: "#8A12FC",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8A12FC",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8A12FC",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8A12FC",
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            {errors.country && (
              <Typography variant="caption" color="error">
                {errors.country}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
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
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
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
            variant="contained"
            component="label"
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
            Upload Profile Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Button
            type="submit"
            variant="contained"
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
            Update Profile
          </Button>
        </Box>
        <style jsx>{`
          .image-container {
            width: 280px;
            height: 280px;
            border-radius: 50%;
            overflow: hidden;
            margin-top: 50px;
            display: inline-block;
            padding: 5px;
            background: linear-gradient(
              45deg,
              rgba(238, 130, 238, 1),
              rgba(255, 192, 203, 1),
              rgba(255, 165, 0, 1)
            );
            background-size: 200% 200%;
            animation: gradientAnimation 2s ease infinite;
          }
          .profile-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </Box>
    </>
  );
}