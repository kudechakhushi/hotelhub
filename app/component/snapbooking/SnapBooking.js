// this is snap booking section show to client on dashboard page
"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  RootContainer,
  Header,
  StyledImage,
  StyledButton,
  ColorfulLoader,
  ErrorMessage,
  MainTitle,
} from "./style";

export default function Home() {
  const [promo, setPromo] = useState({
    // This stores data coming from API:
    mainTitle: "",
    shortDesc: "",
    linkUrl: "",
    photoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await fetch(`/api/bookarea`);
        // Fetches data from API route
        if (!response.ok) {
          throw new Error("Faoled to fetch data");
        }
        // Convert response to JSON
        const data = await response.json();

        setTimeout(() => {
          setPromo({
            mainTitle: data?.mainTitle,
            shortDesc: data?.shortDesc,
            linkUrl: data?.linkUrl,
            photoUrl: data?.photoUrl,
            // Updates UI with API data
          });

          setLoading(false);
        }, 2000);
        // You added a 2-second delay:
      } catch (error) {
        setError(error.message);

        setTimeout(() => setLoading(false), 200);
      }
    };

    fetchPromoData();
  }, []);

  if (loading) return <ColorfulLoader />;

  if (error) return <ErrorMessage error={error} />;
  return (
    <RootContainer maxWidth="xl">
      <MainTitle />

      <Box
  sx={{
    maxWidth: 500,        // keeps content on the left, not full width
    textAlign: "left",
  }}
>
  <StyledImage
    src={promo.photoUrl}
    alt="Luxury Resort"
    onError={(e) => {
      e.target.src = "/images/hotel18.webp";
    }}
    style={{ marginBottom: "16px" }}
  />

  <Header variant="h3">{promo.mainTitle}</Header>

  <Typography variant="body1" sx={{ mb: 2 }}>
    {promo.shortDesc}
  </Typography>

  <StyledButton
    variant="contained"
    href={promo.linkUrl}
    sx={{
      background: "linear-gradient(90deg, #FF3CAC 0%, #784BA0 100%)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 3,
      },
    }}
  >
    Book Now
  </StyledButton>
</Box>
    </RootContainer>
  );
}