// components/BookingSkeletonLoader.js
import { Skeleton, Box, Grid,Container  } from "@mui/material";
// Skeleton → fake loading placeholder
// Box → flexible div with styling
// Grid → layout system (rows/columns)
// Container → centers content and limits width
import { bookingStyles, globalStyles,skeletonAnimation} from "./BookingComponentStyles";

const BookingSkeletonLoader = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} mt={5}>
        {/* Booking Form Skeleton */}
        <Grid size = {{ xs: 12, md: 4 }}  sx={bookingStyles.skeletonForm}>
        {/* xs=12 → full width on mobile */}
        {/* md=4 → 1/3 width on desktop */}
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 2 }} />
          {/* Repeated 4 times:
Looks like input fields
height=50 → matches typical input size
mb:2 → spacing */}
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={50} 
            sx={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.11)',
              mt: 2,
            }} 
            // Same shape as inputs
// Slight red tint → probably meant to mimic button
          />
        </Grid>

        {/* Content Skeleton */}
        <Grid size = {{ xs: 12, md: 8 }}>
          {/* Image Skeleton */}
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              ...bookingStyles.skeletonImage,
              borderRadius: 2,
              mb: 3,
//               Big rectangle → fake image
// ...bookingStyles.skeletonImage → spreads predefined styles
// borderRadius: 2 → rounded corners
            }} 
          />

          {/* Title Skeleton */}
          <Skeleton 
            variant="rectangular" 
            sx={bookingStyles.skeletonTitle}
            animation={skeletonAnimation.wave}
          />

          {/* Price Skeleton */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton 
              variant="rectangular" 
              sx={bookingStyles.skeletonPrice}
              animation={skeletonAnimation.pulse}
            />
            <Skeleton 
              variant="rectangular" 
              sx={bookingStyles.skeletonPrice}
              animation={skeletonAnimation.pulse}
            />
          </Box>

          {/* Description Skeletons */}
          <Skeleton 
            variant="rectangular" 
            sx={bookingStyles.skeletonDescription}
            animation={skeletonAnimation.wave}
          />
          <Skeleton 
            variant="rectangular" 
            sx={bookingStyles.skeletonDescription}
            animation={skeletonAnimation.wave}
          />

          {/* Amenities Skeletons */}
          <Grid container spacing={3} sx={{ my: 4 }}>
            <Grid size = {{ xs: 12, sm: 6 }}>
              {[...Array(5)].map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                  <Skeleton 
                    variant="rectangular" 
                    sx={bookingStyles.skeletonAmenity}
                    animation={i % 2 === 0 ? skeletonAnimation.pulse : skeletonAnimation.wave}
                  />
                </Box>
              ))}
            </Grid>
            <Grid size = {{ xs: 12, sm: 6 }}>
              {[...Array(5)].map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                  <Skeleton 
                    variant="rectangular" 
                    sx={bookingStyles.skeletonAmenity}
                    animation={i % 2 === 0 ? skeletonAnimation.wave : skeletonAnimation.pulse}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>

          {/* Detail Cards Skeletons */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size = {{ xs: 12, sm: 6 }}>
              <Skeleton 
                variant="rectangular" 
                sx={bookingStyles.skeletonDetailCard}
                animation={skeletonAnimation.wave}
              />
            </Grid>
            <Grid size = {{ xs: 12, sm: 6 }}>
              <Skeleton 
                variant="rectangular" 
                sx={bookingStyles.skeletonDetailCard}
                animation={skeletonAnimation.pulse}
              />
            </Grid>
          </Grid>

          {/* Review Section Skeleton */}
          <Skeleton 
            variant="rectangular" 
            height={300}
            sx={{ borderRadius: 2 }}
            animation={skeletonAnimation.wave}
          />
        </Grid>
      </Grid>

      {/* Global styles with animation keyframes */}
      <style jsx global>{`
        ${globalStyles}
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          60% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Container>
  );
};

export default BookingSkeletonLoader;
// Component renders
// No logic → no conditions → always renders skeleton UI
// Parent component decides when to show this