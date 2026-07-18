"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Box,
  Button,
  Rating,
  keyframes,
} from "@mui/material";
import {
  RoomCardContainer,
  RoomImage,
  RoomContent,
  RoomDetails,
} from "./RoomCardStyles";
import { styled } from "@mui/system";
import RoomCard from "./RoomCard";
import { headingStyles } from "./TypographyStyles";
import PeopleIcon from "@mui/icons-material/People";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BedIcon from "@mui/icons-material/Bed";

// Shimmer animation for skeleton
// Defines a loading animation
// Creates a moving light effect across skeletons
const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;
// Creating a custom Skeleton loader
// Enhanced image skeleton with shimmer effect
const ImageSkeleton = styled(Skeleton)({
  width: "100%",
  height: "100%",
  transform: "none", // remove default skeleton animation
  background: "#e0e0e0",
  backgroundImage: `linear-gradient(
    to right,
    #e0e0e0 0%,
    #f5f5f5 20%,
    #e0e0e0 40%,
    #e0e0e0 100%
  )`,
  backgroundSize: "800px 100%",
  animation: `${shimmer} 1.5s infinite linear`,
});

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/homeroom`);

        const data = await res.json();
        // Converts JSON data into JavaScript objects

        setTimeout(() => {
          // Updates state with the fetched data
          setRooms(data);
          // Sets loading state to false
          setLoading(false);
        }, 4000);
        // Waits 4 seconds
      } catch (error) {
        console.log("error fetching rooms", error);

        setTimeout(() => setLoading(false), 4000);
      }
    };


    fetchData()
    // Calls the fetchData function
  }, []);

  const RoomCardSkeleton = () => (
    <RoomCardContainer>
      {/* Improved Image Skeleton */}
      <Box
        sx={{
          width: "55%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          "@media (max-width: 600px)": {
            width: "100%",
            height: "200px", // Fixed height on mobile
          },
        }}
      >
        <ImageSkeleton
          variant="rectangular"
          sx={{
            width: "100%",
            height: "100%",
            transition: "transform 0.3s ease-in-out",
          }}
        />
        {/* Discount badge skeleton */}
        <Skeleton
          width={60}
          height={24}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            borderRadius: 1,
            bgcolor: "rgba(255,0,0,0.2)",
          }}
        />
      </Box>

      <RoomContent>
        <Skeleton width="80%" height={32} animation="wave" />
        <Box sx={{ mb: 1 }}>
          <Rating value={0} readOnly sx={{ color: "transparent" }} />
          <Box sx={{ position: "absolute" }}>
            <Rating value={5} readOnly sx={{ color: "#f0f0f0" }} />
          </Box>
        </Box>
        <Skeleton width="40%" height={24} animation="wave" />
        <Skeleton width="100%" height={72} sx={{ my: 2 }} animation="wave" />

        <RoomDetails>
          {[PeopleIcon, CropSquareIcon, VisibilityIcon, BedIcon].map(
            (Icon, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Icon sx={{ color: "#f0f0f0" }} />
                <Skeleton width="80px" height={20} animation="wave" />
              </Box>
            )
          )}
        </RoomDetails>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{
            marginTop: "16px",
            bgcolor: "rgba(255, 0, 0, 0.1)",
            borderRadius: 1,
            animation: `${shimmer} 2s infinite linear`,
          }}
        />
      </RoomContent>
    </RoomCardContainer>
  );

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h4"
        m={8}
        component="h1"
        align="center"
        gutterBottom
        sx={headingStyles}
      >
        Reserve Your Room (and Your Future)
      </Typography>

      <Grid container spacing={4}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={`skeleton-${index}`}>
                <RoomCardSkeleton />
              </Grid>
            ))
          : rooms.map((room, index) => (
            // Skeleton disappears
// 👉 Real cards appear
            <Grid size={{ xs: 12, sm: 6, md: 6 }} key={room._id || index}>
                <RoomCard room={room} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}
// this is just to show all the rooms in the home page on cllick booknow call in /allrooms page.js
// Page loads
//    ↓
// Heading shows immediately
//    ↓
// loading = true → skeleton shown
//    ↓
// API call → /api/homeroom
//    ↓
// Backend → DB → returns rooms
//    ↓
// Wait 4 sec (your delay)
//    ↓
// setRooms(data)
// setLoading(false)
//    ↓
// Skeleton removed
//    ↓
// Real RoomCard rendered call in page.js