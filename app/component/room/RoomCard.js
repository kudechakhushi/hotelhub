import Link from "next/link";
// Next.js navigation component
import { Box, CardContent, Typography, Rating, Grid } from "@mui/material";
import {
  StyledCard,
  StyledCardMedia,
  DiscountBadge,
  QuickViewOverlay,
  FeatureChip,
  BookNowText,
} from "./RoomCardStyles";

const RoomCard = ({ room, searchParams = {} }) => {
  const { checkIn = "", checkOut = "", guests = "" } = searchParams;
  // Destructuring values from searchParams

  const queryString = new URLSearchParams({
    // It converts an object into a URL query string
    // Creates URL query string like:
    search: room?._id || "",
    // room?._id → safely access _id
    ...(checkIn && { checkIn }),
//     checkIn = "2025-01-01"
// checkIn && { checkIn }
// ➡️ becomes:
// { checkIn: "2025-01-01" }
    ...(checkOut && { checkOut }),
    ...(guests && { guests }),
  });

  return (
    <Link href={`/room-details?${queryString}`} passHref>
      {/* Wraps entire card in a clickable link */}
      <StyledCard>

        <Box sx={{ position: "relative" }}>
          <StyledCardMedia
            component="img"
            height="220"
            image={room.image}
            alt={room.roomtype_id.name}
          />

          {room.discount > 0 && (
            <DiscountBadge>{room.discount}% OFF</DiscountBadge>
          )}
          <QuickViewOverlay>
            <Typography variant="body2">Click to view details</Typography>
          </QuickViewOverlay>
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {room.roomtype_id.name}
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              ${room.price}{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                / night
              </Typography>
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {room.short_desc.split(" ").slice(0, 20).join(" ") +
              (room.short_desc.split(" ").length > 10 ? "..." : "")}
          </Typography>

          <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid size="auto">
              <FeatureChip>{room.view}</FeatureChip>
            </Grid>
            <Grid size="auto">
              <FeatureChip>{room.bed_style}</FeatureChip>
            </Grid>
            <Grid size="auto">
              <FeatureChip>{room.size} sq.ft</FeatureChip>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                value={5}
                readOnly
                precision={0.5}
                size="small"
                sx={{ color: "red", mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                ({parseInt(room.total_adult) + parseInt(room.total_child)}{" "}
                guests)
              </Typography>
            </Box>

            <BookNowText color="primary">Book Now →</BookNowText>
          </Box>
        </CardContent>
      </StyledCard>
    </Link>
  );
};

export default RoomCard;

// Admin creates room

// ⬇

// 2. Data saved in database

// ⬇

// 3. API /api/rooms returns data

// ⬇

// 4. Frontend fetch runs (useEffect)

// ⬇

// 5. Loading state shows

// ⬇

// 6. Data received → state updated

// ⬇

// 7. Component re-renders

// ⬇

// 8. .map() creates multiple RoomCard

// ⬇

// 9. Each card displays room data

// ⬇

// 10. User clicks → navigates with query params