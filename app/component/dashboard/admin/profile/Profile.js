"use client"; // Ensure this is at the top for Next.js to handle the client-side component
// Forces this component to run on the browser (client-side).
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
// UI components from Material UI (MUI)
// List of countries for the dropdown
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  // Add more countries as needed
];
// static list for dropdown

export default function ProfileUpdateForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [profileImage, setProfileImage] = useState("");

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  // errors → form validation errors
  // serverMessage → backend response
  // isSuccess → success vs error UI
  useEffect(() => {
    fetchUserData();
  }, []);
  // Runs once on page load
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/profile", {
        credentials: "include",
        // credentials: "include" → sends cookies (for auth)
      })
      if (!response.ok) {
        throw new Error("failed to fetch user data");
      }

      const data = await response.json();

      setEmail(data?.email);
      // ?. = optional chaining (safe access)
      setName(data?.name);
      setProfileImagePreview(data?.image);
      setMobileNumber(data?.mobileNumber || data?.phoneNumber || "");

      setAddress(data?.address || "");
      setCountry(data?.country);
    } catch (error) {
      console.log("error fetching user data", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name) errors.name = "name is required";

    if (!email) {
      errors.email = "email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "email is invalid";
    }

    if (!mobileNumber && !/^[0-9]{10}$/.test(mobileNumber)) {
      errors.mobileNumber = "please enter a valid 10  digit mobile number";
    }

    if (address && address.length < 5) {
      errors.address = "Address is too short";
    }

    if (
      country &&
      !countries.some((c) => c.code === country || c.name === country)
      // Checks if selected value exists in list
    ) {
      errors.country = "Please select a valid country";
    }

    if (!password) errors.password = "Password is required";

    if (password !== confirmPassword) {
      errors.confirmPassword = "Password  do not match";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
    // Returns true if no errors
  };

  const handleImageChange = (e) => {
//     [0]
// This means: “Give me the FIRST file the user selected”
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        // After reading → store preview
      };
      reader.readAsDataURL(file);
      // Convert file → base64 (for preview)
    }
  };
  // Cloudinary is a service that:
  // Stores your images/videos
  // Gives you a URL to access them Handles resizing, compression, CDN delivery
  // 👉 Instead of saving images in your own server/database (bad idea for scaling), you offload that job to Cloudinary.
//   Why Cloudinary Wins
// 1. Auto Optimization

// You can literally do this:

// https://res.cloudinary.com/demo/image/upload/w_300,h_300/sample.jpg

// 👉 Image auto-resized

// 2. CDN (Fast Delivery)

// Images served from nearest location to user.

// 3. Zero Backend Work

// No file system handling. No storage logic.

// 4. Handles Videos Too

// Not just images—videos, GIFs, etc.

// 5. Scales Automatically

// 1 user or 1 million users → same setup
  const uploadImageToCloudinary = async (image) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    // You’re reading an environment variable
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured");
  }
  // Creating a FormData object
    const formData = new FormData();
    formData.append("file", image);
//     Attaching the actual file

// "file" = required key by Cloudinary API
// image = your File object
    formData.append("upload_preset", "ml_default");
    // upload_preset = config stored in Cloudinary dashboard
    // "ml_default" = default preset (usually unsigned upload)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
//         Sending request

// POST → because you're uploading
// body → contains file + preset
     }
    );

    const data = await response.json();
    console.log(data);
    // response.ok → true if status is 200-299
    // secure_url → URL to access the image
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Image upload failed");
    }
    return data.secure_url;
    // Returns image URL from Cloudinary
// This is what you store in DB
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //alert("submit form")
    setServerMessage("");

    if (!validateForm()) return;

    let imageUrl = profileImagePreview;
    if (profileImage) {
      try {
      imageUrl = await uploadImageToCloudinary(profileImage);
      } catch (error) {
        setIsSuccess(false);
        setServerMessage(error.message);
        return;
      }
      setIsSuccess(true);
      setServerMessage("Image Uploaded successfully");
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

    console.log(requestBody);
    // sending data from frontend → your server
    const response = await fetch("/api/admin/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsSuccess(false);
      setServerMessage(data?.err);
    } else {
      setIsSuccess(true);

      setServerMessage(data?.msg);

      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: "url(/images/pic2.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
//             Responsive:mobile (xs) → vertical layout
// desktop (sm) → horizontal layout
            gap: 2,
            maxWidth: 1300,
            margin: "0 auto",
            padding: 2,
            overflow: "hidden",
            backgroundColor: "rgba(31, 15, 15, 0.6)",
            marginTop: "29px",
            padding: "40px",
            color: "white",
          }}
        >
          {/* LEFT SIDE (Image Section) */}
          {/* // order: { xs: 2, sm: 1 } → mobile: image on bottom, desktop: image on left
          // flex: { xs: "none", sm: 1 } → mobile: image doesn't grow, desktop: image takes full width
          // textAlign: { xs: "center", sm: "left" } → mobile: center align, desktop: left align */}
          <Box
            sx={{
              order: { xs: 2, sm: 1 },
              flex: { xs: "none", sm: 1 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {/* Only show image if it exists */}
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
          {/* RIGHT SIDE Opposite of image: 
          mobile → shows first
             desktop → right side */}
          <Box
            sx={{
              order: { xs: 1, sm: 2 },
              flex: { xs: 1, sm: 2 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
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
                input: { color: "white" },
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
                input: { color: "white" },
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
                input: { color: "white" },
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
                textarea: { color: "white" },
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
              <InputLabel id="country-select-label" sx={{ color: "#8A12FC" }}>
                Country
              </InputLabel>
              <Select
                labelId="country-select-label"
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                error={!!errors.country}
                sx={{
                  color: "white",
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
                  <MenuItem key={country.code} value={country.name}>
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
                input: { color: "white" },
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
                input: { color: "white" },
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
          // circular container
            .image-container {
              width: 280px;
              height: 280px;
              border-radius: 50%;
              overflow: hidden;
              // ensures image stays inside circle
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
              // animated gradient border
            }
            .profile-image {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
            @keyframes gradientAnimation {
            // moves gradient → animated effect
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
      </Box>
    </>
  );
}