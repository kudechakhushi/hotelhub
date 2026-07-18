import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
// Card → container
// CardContent → content section inside card
// Typography → text
// CardMedia → image display
// Box → flexible layout wrapper (div replacement) it run in checkout url come from bookingdetail component
import {
  NightsStay as NightsIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Hotel as RoomIcon,
  Receipt as ReceiptIcon,
  Discount as DiscountIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { bookingSummaryStyles } from "./bookingSummaryStyles";


const BookingSummary = ({ pricingData }) => {
  if (!pricingData) return null;

  const {
    pricePerNight,
    nights,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    rooms,
    guests,
    roomTypeName,
    checkIn,
    checkOut,
    image,
  } = pricingData;
//   Extracts values from API response
  const formatDate = (dateString) => {
    // Converts raw date → readable format
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    // Converts string → Date → formatted string 
    // Jan 5, 2026
    // en-us Format this data using U.S. English rules.”
  };



// Icon colors and configurations
const details = [
  {
    icon: <NightsIcon fontSize="small" />,
    label: "Nights",
    value: `${nights} ${nights === 1 ? "Night" : "Nights"}`,
    iconStyle: {
      background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      color: "#d32f2f",
    },
  },
  {
    icon: <CalendarIcon fontSize="small" />,
    label: "Dates",
    value: `${formatDate(checkIn)} - ${formatDate(checkOut)}`,
    iconStyle: {
      background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      color: "#1976d2",
    },
  },
  {
    icon: <PeopleIcon fontSize="small" />,
    label: "Guests",
    value: guests,
    iconStyle: {
      background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      color: "#2e7d32",
    },
  },
  {
    icon: <RoomIcon fontSize="small" />,
    label: "Rooms",
    value: rooms,
    iconStyle: {
      background: "linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%)",
      color: "#e65100",
    },
  },
];




  return (
    <Card sx={bookingSummaryStyles.card}>
      <CardMedia
        component="img"
        sx={bookingSummaryStyles.media}
        image={image || "/images/hotel3.jpg"}
        alt={roomTypeName}
      />

      <Box sx={bookingSummaryStyles.header}>
        <Typography component="div" variant="h5">
          <StarIcon sx={{ color: "#ffeb3b", mr: 1, fontSize: "1.2rem" }} />
          {roomTypeName}
        </Typography>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, pt: 2 }}>
          <Box sx={bookingSummaryStyles.priceHighlight}>
            <Typography component="span">
              ${Number(pricePerNight).toFixed(2)}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: "0.9rem", opacity: 0.8, ml: 0.5 }}
            >
              /night
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 1 }}>
          {details.map((detail, index) => (
            <Box key={index} sx={bookingSummaryStyles.detailItem}>
              <Box sx={bookingSummaryStyles.detailLabel}>
                <Box
                  sx={{
                    ...bookingSummaryStyles.iconContainer,
                    ...detail.iconStyle,
                  }}
                //   Merges base styles + custom styles
                >
                  {detail.icon}
                </Box>
                <Typography component="span">{detail.label}</Typography>
              </Box>
              <Typography component="div" sx={bookingSummaryStyles.detailValue}>
                {detail.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box>
          <Box sx={bookingSummaryStyles.detailItem}>
            <Box sx={bookingSummaryStyles.detailLabel}>
              <Box
                sx={{
                  ...bookingSummaryStyles.iconContainer,
                  background:
                    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
                  color: "#ff6d00",
                }}
              >
                <ReceiptIcon fontSize="small" />
              </Box>
              <Typography component="span">Subtotal</Typography>
            </Box>
            <Typography component="div" sx={bookingSummaryStyles.detailValue}>
              ${Number(subtotal).toFixed(2)}
            </Typography>
          </Box>

          <Box sx={bookingSummaryStyles.detailItem}>
            <Box sx={bookingSummaryStyles.detailLabel}>
              <Box
                sx={{
                  ...bookingSummaryStyles.iconContainer,
                  background:
                    "linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)",
                  color: "#9c27b0",
                }}
              >
                <DiscountIcon fontSize="small" />
              </Box>
              <Typography component="span">Discount</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography component="div" sx={bookingSummaryStyles.detailValue}>
                -${Number(discountAmount).toFixed(2)}
              </Typography>
              <Box sx={bookingSummaryStyles.discountBadge}>
                {discountPercent}% OFF
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={bookingSummaryStyles.totalContainer}>
          <Typography component="div" sx={bookingSummaryStyles.totalLabel}>
            Total
          </Typography>
          <Typography component="div" sx={bookingSummaryStyles.totalValue}>
            ${Number(total).toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;

// STEP 1: Component receives props
// <BookingSummary pricingData={data} />
// 🟡 STEP 2: Guard check
// If no data → nothing renders
// 🟠 STEP 3: Data extracted
// price, nights, dates, etc.
// 🔵 STEP 4: details array built
// Creates structured UI config
// 🟣 STEP 5: UI renders
// Image
// Room title
// Price per night
// Booking details (mapped)
// Subtotal
// Discount
// Total
// this is show in  checkout page 