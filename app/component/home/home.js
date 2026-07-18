// Homepage component for checking availability
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Used to navigate programmatically
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BackgroundContainer,
  TransparentBox,
  TransparentBoxx,
} from "@/app/component/home/style/backgroundStyles";
import {
  datePickerStyles,
  dateLabelStyles,
  buttonStyles,
  heroOverlayStyles,
  titleTextStyles,
  formContainerStyles,
  selectStyles,
} from "@/app/component/home/style/customStyles";

export default function Homepage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  // theme → MUI theme config
  // isSmallScreen → true if mobile
  // router → used later to redirect
  // State to store form values
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });
//   This stores user input:
// check-in date
// check-out date
// number of guests

  const [errors, setErrors] = useState({
    checkInDate: false,
    checkOutDate: false,
  });
  // show red error in inputs
// track missing fields

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // name → which field (checkInDate, etc.)
// value → user input
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Keeps old data
// Updates only changed field
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
      // If user starts typing → remove error
    }
  };

  // Handle select changes specifically
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // Ensure we store as number
      // Forces value to number
// Without this → it becomes string "2" instead of 2
    }));
  };

  // Format date for display and comparison
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  // Converts date into:
  // YYYY-MM-DD

  // Handle form submission
  const handleCheckAvailability = () => {
    let hasErrors = false;
    const newErrors = { checkInDate: false, checkOutDate: false };

    if (!formData.checkInDate) {
      newErrors.checkInDate = true;
      hasErrors = true;
    }
    // Check empty fields

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      alert("Please fill all required fields");
      return;
    }
    // Stops execution
// Shows alert

    const checkIn = formatDate(formData.checkInDate);
    const checkOut = formatDate(formData.checkOutDate);
    // Format Dates
    // Additional validation: check-out must be after check-in
    if (new Date(checkOut) <= new Date(checkIn)) {
      // Converts both checkOut and checkIn (strings like "2026-07-10") into Date objects
      alert("Check-out date must be after check-in date");
      setErrors((prev) => ({
        ...prev,
        checkOutDate: true,
        // Takes previous error object
// Updates only checkOutDate
// This makes your checkout input field turn red
      }));
      return;
    }

    router.push(
      `/allrooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${formData.guests}`
    );
    //if true then Redirects user to:
// /allrooms?checkIn=2026-07-10&checkOut=2026-07-12&guests=2
  };

  // Options for guests dropdown
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Calculate minimum checkout date (checkin date or today)
  const minCheckoutDate =
    formData.checkInDate || new Date().toISOString().split("T")[0];
    // If check-in selected → checkout can't be before it
    // Else → today is minimum
  
    return (
      <BackgroundContainer>
        <Container
  maxWidth="lg"
  sx={{
    p: 0,
    m: 0,
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",  // left align, not center
    alignItems: "stretch",
  }}
>
          <Box sx={heroOverlayStyles}>
            {/* Title box */}
            <TransparentBoxx>
              <Typography component="h1" sx={titleTextStyles.title}>
                Listify: Discover, Compare, and Choose
              </Typography>
              <Typography component="h2" sx={titleTextStyles.subtitle}>
                Your Ultimate Guide to Finding the Best Products, Services, and
                Deals Online
              </Typography>
            </TransparentBoxx>
    
            {/* Form box — same width as title */}
            <TransparentBox>
              <Box sx={formContainerStyles(isSmallScreen)}>
                <TextField
                  id="checkInDate"
                  name="checkInDate"
                  label="Check-in Date"
                  type="date"
                  sx={datePickerStyles}
                  slotProps={{
                    inputLabel: { shrink: true, ...dateLabelStyles },
                    htmlInput: { min: new Date().toISOString().split("T")[0] },
                  }}
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  error={errors.checkInDate}
                />
    
                <TextField
                  id="checkOutDate"
                  name="checkOutDate"
                  label="Check-out Date"
                  type="date"
                  sx={datePickerStyles}
                  slotProps={{
                    inputLabel: { shrink: true, ...dateLabelStyles },
                    htmlInput: { min: minCheckoutDate },
                  }}
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  error={errors.checkOutDate}
                />
    
                <FormControl sx={selectStyles}>
                  <InputLabel id="guests-label">Number of Guests</InputLabel>
                  <Select
                    labelId="guests-label"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    label="Number of Guests"
                    onChange={handleSelectChange}
                  >
                    {guestOptions.map((number) => (
                      <MenuItem key={number} value={number}>
                        {number} {number === 1 ? "Guest" : "Guests"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
    
                <Button
                  variant="contained"
                  sx={buttonStyles}
                  onClick={handleCheckAvailability}
                >
                  Check Availability
                </Button>
              </Box>
            </TransparentBox>
          </Box>
        </Container>
      </BackgroundContainer>
    );
}

// Page loads
// User selects:
// check-in
// check-out
// guests
// State updates live (useState)
// User clicks button
// Validation runs:
// empty fields ❌
// invalid date ❌
// If valid:
// format dates
// redirect using router
// Next page (/allrooms) receives data via URL