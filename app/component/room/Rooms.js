// this is for client side when click on book now this open
// Reads search filters from URL
// Calls your backend (/api/homeroom)
// Shows loading skeleton
// Displays rooms using RoomCard
// Handles empty results/
"use client";

import { useEffect, useState } from "react";
import { Container, Box, Grid, Typography, Skeleton } from "@mui/material";
import { useSearchParams } from "next/navigation";
// Reads query params from URL like:
import RoomCard from "./RoomCard";
import { mainHeadingStyles, subHeadingStyles } from "./HeadingStyles";

const RoomsRates = () => {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  // Example URL:
  // /rooms?checkIn=2025-01-01&guests=2
  // Converts URL params into an object
  const searchParamsObj = {
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
    guests: searchParams.get("guests"),
  };
  // It takes values from the URL query string and converts them into a usable JavaScript object

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        // Prepare query params
        if (searchParamsObj.checkIn)
          params.append("checkIn", searchParamsObj.checkIn);
        // Checks: does checkIn exist and is it truthy?
        // If yes → adds it to params
        if (searchParamsObj.checkOut)
          params.append("checkOut", searchParamsObj.checkOut);

        if (searchParamsObj.guests)
          params.append("guests", searchParamsObj.guests);

        let url = `/api/homeroom`;
        // This is your base endpoint
        if (
          searchParamsObj.checkIn ||
          searchParamsObj.checkOut ||
          searchParamsObj.guests
        ) {
          url = `/api/homeroom/${params.toString()}`;
//           params.toString() converts everything into query format:
// checkIn=2026-07-10&guests=2
// So final URL becomes:
// /api/homeroom/checkIn=2026-07-10&guests=2
        }

        const res = await fetch(url);
// Makes HTTP GET request to the URL
        const data = await res.json();
// Converts JSON response into JavaScript object
        setRooms(data);
        // Updates rooms state with the new data
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);
//   fetchData() runs inside a useEffect
// [searchParams] = dependency array
// Meaning:
// Every time searchParams changes → fetchData() runs again

  // Skeleton loader component
  const RoomCardSkeleton = () => (
    <Box sx={{ height: "100%" }}>
      <Skeleton variant="rectangular" height={220} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="60%" height={32} />
        <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
        <Skeleton width="100%" height={72} sx={{ mt: 1 }} />
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Skeleton width="20%" height={30} />
          <Skeleton width="20%" height={30} />
          <Skeleton width="20%" height={30} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Skeleton width="40%" height={24} />
          <Skeleton width="30%" height={24} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: "2rem" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={mainHeadingStyles}
        >
          Check In & Chill Out
        </Typography>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={subHeadingStyles}
        >
          Unwind in style with our premium hospitality.
        </Typography>

        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <RoomCardSkeleton />
              </Grid>
            ))
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              // Loop through rooms
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id || room._id}>
                  {/* esponsive layout */}
                  {/* Uses ID as key (good fallback logic) */}
                <RoomCard room={room} searchParams={searchParamsObj} />
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Typography align="center" sx={{ py: 4 }}>
                No rooms available for the selected criteria
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default RoomsRates;

// User clicks "check availability"

// 👉 Navigates to:

// /rooms?checkIn=...&guests=...
// Step 2: This component loads
// useSearchParams() reads URL
// Extracts filters
// Step 3: useEffect runs
// Builds API URL
// Calls backend
// Step 4: Backend
// Fetches rooms from DB
// Filters data
// Sends JSON
// Step 5: Frontend
// Stores in rooms
// Stops loading
// Step 6: UI updates
// Skeleton → disappears
// Room cards → appear
// User → Frontend (React) → fetch() → /api/homeroom → Backend (Next.js API)
//      → MongoDB → Data → Response → Frontend → UI updates