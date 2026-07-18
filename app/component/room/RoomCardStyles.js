import { styled } from '@mui/system';
// Used to create custom styled components
import { Card, CardMedia, Box, Typography } from '@mui/material';
// Card → container (main UI card)
// CardMedia → for images/videos inside card
// Box → flexible div
// Typography → text component
export const StyledCard = styled(Card)({
  // Creating a custom card component
  cursor: 'pointer',
  height: '100%',
  // Card takes full height of parent
  display: 'flex',
  flexDirection: 'column',
  // Makes card layout vertical:
// image on top
// content below
  transition: 'all 0.3s ease',
  // Smooth animation for changes
  '&:hover': {
    transform: 'translateY(-5px)',
    // Card moves up slightly → floating effect
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    // Shadow increases → depth effect
  }
});

export const StyledCardMedia = styled(CardMedia)({
  // Styling image inside card
  transition: 'transform 0.3s',
  // Smooth zoom animation
  filter: 'brightness(0.95)',
  // Slightly dim image initially
  '&:hover': {
    // Brightness increases
// Image zooms slightly
    filter: 'brightness(1)',
    transform: 'scale(1.05)'
  }
});

export const DiscountBadge = styled(Box)({
  // Small label (like “20% OFF”)
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#f44336',
  color: 'white',
  padding: '4px 12px',
  borderRadius: 4,
  // Small rounded badge
  fontSize: '0.8rem',
  fontWeight: 'bold'
});

export const QuickViewOverlay = styled(Box)({
  // Overlay that appears on image (like “Quick View”)
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  // Sticks to bottom of image
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  // Dark transparent background
  // Centers text inside
  textAlign: 'center',
  // Padding inside overlay
  padding: '8px 0',
  opacity: 0,
  // Smooth fade in effect
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1
  }
});

export const FeatureChip = styled(Box)({
  // Small label for features (e.g. “Free WiFi”)
  padding: '4px 8px',
  backgroundColor: '#f5f5f5',
  borderRadius: 4,
  fontSize: '0.75rem'
});

export const BookNowText = styled(Typography)({
  // Styled text for “Book Now”
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  color: '#1976d2',
  '&:hover': {
    // Underline on hover
    textDecoration: 'underline'
  }
});