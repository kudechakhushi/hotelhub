// components/BookingComponent.js this is call in room-detail page when
//  click on book know and all detail of hotel with price show 
// using api/user/rooms/[id]/route.js
"use client";

import { useState, useEffect } from "react";

import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  ListItemIcon,
  Alert,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { Paper, Chip, Divider, Rating } from "@mui/material";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import SeaViewIcon from "@mui/icons-material/BeachAccess";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutlined";
import SquareFootIcon from "@mui/icons-material/CropSquare";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HotelIcon from "@mui/icons-material/Hotel";
import SendIcon from "@mui/icons-material/Send";
import { Suspense } from 'react';
import Rooms from "@/app/component/rooms/Rooms";
import {
  bookingStyles,
  globalStyles,
  pricingSummaryStyles,
} from "./BookingComponentStyles";
import BookingSkeletonLoader from "./BookingSkeletonLoader";
import { useSearchParams } from "next/navigation";
 // Import useSearchParams
//  Next.js hook used to read query parameters from the URL.
import { format, parseISO, isAfter } from "date-fns";
 // Date handling utilities
//  This is a date utility library — way better than raw JS Date.
// parseISO("2026-07-10")
//  What it does:
// Converts a string → Date object
import ImageSlider from './ImageSlider'
const PLACEHOLDER_IMAGE = "/images/hotel17.jpg";
// A fallback image
const BookingComponent = ({
  content,
//   content → data from backend (room details)
  loading,
  setLoading,
}) => {
  const searchParams = useSearchParams();
//   Reads query params from URL
  const roomData = content?.[0];
//   Takes first room from array
  const originalPrice = parseFloat(roomData?.price);
//   Converts price (string) → number
  // Get current date in YYYY-MM-DD format (for date input min attribute)
  const today = new Date().toISOString().split("T")[0];
//   Gets current date
//   Converts to format: YYYY-MM-DD
  // Extract query params
  const roomId = searchParams?.get("search") || "";
//   Gets:Room ID from URL
  const initialCheckIn = searchParams?.get("checkIn") || today; 
//   Logic:
// If URL has checkIn → use it
  // Default to today
  const initialCheckOut = searchParams?.get("checkOut") || "";
  const initialGuests = searchParams?.get("guests") || "1";

  // State management
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [rooms, setRooms] = useState("1");
  const [dateError, setDateError] = useState(null);

  // Add new state for room validation
  const [roomError, setRoomError] = useState(null);
  const availableRooms = roomData?.room_numbers?.length || 0;
//   Counts how many rooms are available
  const isRoomAvailable = availableRooms > 0;
//   If at least 1 room → available
  const [pricingData, setPricingData] = useState({
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    total: 0,
  });
//   Get room data from backend (content)
//   Read user input from URL (dates, guests)
//   Initialize form state
//   Track:
//   selected dates
//   guests
//   rooms
//   Check:
//   if rooms exist
//   Prepare pricing structure

  // Room validation effect
  useEffect(() => {
    if (availableRooms > 0 && parseInt(rooms) > availableRooms) {
        // availableRooms > 0 → at least some rooms exist
// parseInt(rooms) → converts string → number
      setRoomError(`Only ${availableRooms} rooms available`);
    //   Sets error message if user selects too many rooms
    } else {
      setRoomError(null);
    }
  }, [rooms, availableRooms]);
//   This effect runs when:
// rooms changes
// availableRooms changes
// User selects number of rooms
// Code checks if it exceeds available
// If yes → show error
// If no → clear error

  // Date validation effect
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
    //   String → Date object
      const checkOutDate = new Date(checkOut);
      const todayDate = new Date(today);

      // Check if check-in is in the past
      if (checkInDate < todayDate) {
        setDateError("Check-in date cannot be in the past");
        return;
      }

      // Check if check-out is before or equal to check-in
      if (checkOutDate <= checkInDate) {
        setDateError("Check-out date must be after check-in date");
        return;
      }

      setDateError(null);
    }
  }, [checkIn, checkOut, today]);
//   checkIn changes
//   checkOut changes
//   today changes (rare, but okay)/
  // Your existing API request effect

  useEffect(() => {
    const fetchUpdatedData = async () => {
        // Stops API call if:
      if (!roomId || !checkIn || !checkOut || dateError || roomError) return;

      try {
        setLoading(true);
        const query = new URLSearchParams({
          roomId,
          checkIn,
          checkOut,
          guests,
          rooms,
        }).toString();
        // Creates query like:
        // roomId=123&checkIn=2026-07-10&checkOut=2026-07-12&guests=2&rooms=1
        const res = await fetch(`/api/user/rooms/${query}`);
        const data = await res.json();


         console.log("pricing data", data)
        // Update pricing data state
        setPricingData({
          subtotal: data.subtotal || 0,
          discountPercent: data.discountPercent || 0,
          discountAmount: data.discountAmount || 0,
          total: data.total || 0,
        });
        // Stores API response into state
        console.log("Updated room data:", data);
      } catch (error) {
        console.log("Failed to fetch updated room data:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchUpdatedData, 500);
    // Waits 500ms before calling API
    return () => clearTimeout(debounceTimer);
    // Cancels previous timer if user changes input quickly
  }, [roomId, checkIn, checkOut, guests, rooms, dateError]);




  useEffect(() => {
    if (!content) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    //   Stops loading after 1 second
      return () => clearTimeout(timer);
    //   Cancels previous timer if content changes
    }
  }, [content]);



const handleSubmit = (e) => {
  e.preventDefault();
//   Stops the browser’s default behavior (which is page reload).
  // Create URLSearchParams object
  const params = new URLSearchParams();
//   Creates an object to build URL query parameters.
  params.append('roomId', roomId);
//   Adds roomId to URL.
  params.append('checkIn', checkIn);
  params.append('checkOut', checkOut);
  params.append('guests', guests);
  params.append('rooms', rooms);

  // Redirect to checkout with plain URL params
  window.location.href = `/checkout?${params.toString()}`;
};



  if (loading) {
    return <BookingSkeletonLoader />;
  }

  return (


 <Suspense fallback={<div>Loading room details...</div>}>
    <Container maxWidth="xl" sx={bookingStyles.container}>
      <Grid container spacing={2} mt={5}>
        <Grid size = {{ xs: 12, md: 4 }} sx={bookingStyles.bookingFormContainer}>
          <form 
          
          onSubmit={handleSubmit}
          
          
          >
            <Typography variant="h6" sx={bookingStyles.bookingFormTitle}>
              Booking Sheet
            </Typography>
            <TextField
              label="Check In"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: today },
              }}
              margin="normal"
            
              
              error={!!dateError}
            />
            <TextField
              label="Check Out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: checkIn || today },
              }}
             
              margin="normal"
              error={!!dateError}
              helperText={dateError || " "}
            />

            <TextField
              label="Number of Persons"
              select
              fullWidth
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              margin="normal"
              error={parseInt(guests) > (roomData?.total_adult || 1)}
            //   If selected guests > allowed adults → error = true
              helperText={
                parseInt(guests) > (roomData?.total_adult || 1)
                  ? `Maximum ${roomData?.total_adult} persons allowed`
                  : " "
              }
            //   Shows error message if limit exceeded
            >
              {Array.from(
                { length: Math.min(8, roomData?.total_adult || 8) },
                (_, i) => i + 1
              ).map((option) => (
                <MenuItem key={option} value={option.toString()}>
                  {option}
                </MenuItem>
                // total_adult = 5 → options = 1 to 5
              ))}
            </TextField>

            <TextField
              label="Number of Rooms"
              select
              fullWidth
              value={isRoomAvailable ? rooms : "0"}
            //   If rooms available → show selected rooms
// Else → force value "0"
              onChange={(e) => setRooms(e.target.value)}
              margin="normal"
              disabled={!isRoomAvailable}
            >
              {isRoomAvailable ? (
                Array.from(
                  { length: Math.min(6, availableRooms) },
                  (_, i) => i + 1
                ).map((option) => (
                  <MenuItem key={option} value={option.toString()}>
                    {option}
                  </MenuItem>
                //   Max 6 rooms selectable
                //   Or less if availableRooms is smaller
                ))
              ) : (
                <MenuItem value="0">No rooms available</MenuItem>
              )}
            </TextField>

            <Box sx={{ mt: 2, mb: 2 }}>
              {isRoomAvailable ? (
                <Typography variant="body2" color="text.secondary">
                  Room availability: {availableRooms}{" "}
                  {availableRooms === 1 ? "room" : "rooms"}
                </Typography>
              ) : (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Rooms currently unavailable
                </Alert>
              )}
            </Box>

            {loading ? (
              <Box sx={pricingSummaryStyles.container}>
                <Typography sx={pricingSummaryStyles.title}>
                  Loading pricing...
                </Typography>
              </Box>
            ) : (
              <Box sx={pricingSummaryStyles.container}>
                <Typography sx={pricingSummaryStyles.title}>
                  Pricing Summary
                </Typography>

                <Box sx={pricingSummaryStyles.row}>
                  <Typography sx={pricingSummaryStyles.label}>
                    Subtotal:
                  </Typography>
                  <Typography sx={pricingSummaryStyles.value}>
                    ${pricingData.subtotal.toFixed(2)}
                    {/* Shows subtotal with 2 decimals */}
                  </Typography>
                </Box>

                {pricingData.discountPercent > 0 && (
                  <>
                    <Box sx={pricingSummaryStyles.row}>
                      <Typography sx={pricingSummaryStyles.label}>
                        Discount ({pricingData.discountPercent}%):
                      </Typography>
                      <Typography sx={pricingSummaryStyles.discountValue}>
                        -${pricingData.discountAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </>
                )}

                <Divider sx={pricingSummaryStyles.divider} />

                <Box sx={pricingSummaryStyles.totalRow}>
                  <Typography sx={pricingSummaryStyles.totalLabel}>
                    Total:
                  </Typography>
                  <Typography sx={pricingSummaryStyles.totalValue}>
                    ${pricingData.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Button

 type="submit"

              variant="contained"
              fullWidth
              sx={bookingStyles.bookNowButton}
              disabled={!!dateError || !isRoomAvailable || loading}
            >
              {isRoomAvailable ? "Book Now" : "Unavailable"}
            </Button>
          </form>
        </Grid>

        <Grid size = {{ xs: 12, md: 8 }}>
          {/* Animated Image with Zoom Effect */}


 <ImageSlider images={roomData?.gallery_images} />
        

          {/* Modern Card Container */}
          <Box sx={bookingStyles.roomCard}>
            {/* Animated Title */}
            <Typography variant="h4" gutterBottom sx={bookingStyles.roomTitle}>
              {roomData?.roomtype_id?.name}
            </Typography>

            {/* Price with Badge */}
            <Box sx={bookingStyles.priceContainer}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Price:
              </Typography>
              <Chip
                label={`$${originalPrice}/Night`}
                color="primary"
                sx={bookingStyles.originalPriceChip}
              />
            </Box>

            {/* Description with Fade-in Animation */}
            <Box sx={bookingStyles.descriptionBox}>
              <Typography variant="body1" sx={bookingStyles.descriptionText}>
                {roomData?.short_desc}
              </Typography>

              <Typography
                variant="body1"
                sx={bookingStyles.longDescriptionText}
              >
                {roomData?.description}
              </Typography>
            </Box>

            {/* Amenities Grid with Hover Effects */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size = {{ xs: 12, sm: 6 }}>
                <List dense>
                  {roomData?.facilities
                    .slice(0, Math.ceil(roomData?.facilities.length / 2))
                    .map((facility, index) => (
                      <ListItem key={index} sx={bookingStyles.amenityItem}>
                        <ListItemIcon
                          sx={{ minWidth: 36, color: "primary.main" }}
                        >
                          <CheckCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={facility}
                          slotProps={{
                            primary: { sx: { fontWeight: 500 } },
                          }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
              <Grid size = {{ xs: 12, sm: 6 }}>
                <List dense>
                  {roomData?.facilities
                    .slice(Math.ceil(roomData?.facilities.length / 2))
                    .map((facility, index) => (
                      <ListItem key={index} sx={bookingStyles.amenityItem}>
                        <ListItemIcon
                          sx={{ minWidth: 36, color: "primary.main" }}
                        >
                          <CheckCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={facility}
                          slotProps={{
                            primary: { sx: { fontWeight: 500 } },
                          }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
            </Grid>

            {/* Facilities with Animated Chips */}
            <Box sx={bookingStyles.amenitiesContainer}>
              <Typography
                variant="h6"
                gutterBottom
                sx={bookingStyles.facilitiesTitle}
              >
                Room Facilities
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {roomData?.facilities.map((facility, index) => (
                  <Chip
                    key={index}
                    label={facility}
                    size="small"
                    sx={bookingStyles.facilityChip}
                  />
                ))}
              </Box>
            </Box>

            {/* Room Details Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size = {{ xs: 12, sm: 6 }}>
                <Box sx={bookingStyles.detailCard}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    <Box component="span" sx={{ color: "primary.main" }}>
                      Room
                    </Box>{" "}
                    Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PeopleOutlineIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      Adults: {roomData?.total_adult}, Children:{" "}
                      {roomData?.total_child}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SquareFootIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      Size: {roomData?.size} ft²
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size = {{ xs: 12, sm: 6 }}>
                <Box sx={bookingStyles.detailCard}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    <Box component="span" sx={{ color: "primary.main" }}>
                      View &
                    </Box>{" "}
                    Bed
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <VisibilityIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      View: {roomData?.view}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HotelIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      Bed Style: {roomData?.bed_style}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Review Section */}
            <Box sx={bookingStyles.reviewSection}>
              <Typography
                variant="h6"
                gutterBottom
                sx={bookingStyles.reviewTitle}
              >
                Clients Review and Ratings
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating
                  name="client-rating"
                  defaultValue={4.5}
                  precision={0.5}
                  icon={
                    <LocalHotelIcon
                      fontSize="inherit"
                      sx={{ color: "primary.main" }}
                    />
                  }
                  emptyIcon={
                    <LocalHotelIcon
                      fontSize="inherit"
                      sx={{ color: "action.disabled" }}
                    />
                  }
                />
                <Typography
                  variant="body2"
                  sx={{ ml: 1, color: "text.secondary" }}
                >
                  (4.5/5 from 128 reviews)
                </Typography>
              </Box>

              <TextField
                label="Write your review here..."
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                sx={bookingStyles.reviewTextField}
              />

              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={bookingStyles.submitReviewButton}
              >
                Submit Review
              </Button>
            </Box>
          </Box>

          {/* Keyframe animations */}
          <style jsx global>
            {globalStyles}
          </style>
        </Grid>
      </Grid>

      <Rooms />
    </Container>

</Suspense>

  );
};

export default BookingComponent;

// Page starts loading → no data yet
// Instead of showing blank screen → show fake UI (skeletons)
// Once real data arrives → this component disappears
// Real content replaces it

// 👉 This improves UX. Without this, your UI would feel broken or slow