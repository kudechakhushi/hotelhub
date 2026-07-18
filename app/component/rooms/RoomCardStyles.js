import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const RoomCardContainer = styled(Box)({
    // You are creating a custom component based on Box.
    backgroundColor: 'white',
    borderRadius: '8px',
    // Rounded corners.
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    // Adds shadow → gives card look.
    overflow: 'hidden',
    // Prevents content (like images) from overflowing outside the box.
    marginBottom: '16px',
    // Adds space below each card.
    display: 'flex',
    flexDirection: 'row',
    // Makes it a flex container.
// Items inside will be arranged side by side (row).
    '@media (max-width: 600px)': {
        flexDirection: 'column',
    },
    // Responsive design:
// On small screens (mobile), layout changes to column (stacked).
});

export const RoomImage = styled('img')({
    // You are styling a normal <img> tag.
    width: '55%',
    height: 'auto',
    // Keeps aspect ratio correct.
    transition: 'transform 0.3s ease-in-out',
    // Smooth animation for transform changes.
    '&:hover': {
        transform: 'scale(1.05)',
        // On hover:
// Image slightly zooms (1.05x)
    },
    '@media (max-width: 600px)': {
        width: '100%',
    },
});

export const RoomContent = styled(Box)({
    padding: '16px',
    display: 'flex',
    // Flex layout again
    flexDirection: 'column',
    justifyContent: 'center',
    // Centers content vertically inside container.
});

export const RoomDetails = styled(Box)({
    // Another styled Box → holds text/content.
    display: 'flex',
    alignItems: 'center',
    // Vertically aligns items in the center.
    gap: '8px',
    flexWrap: 'wrap',
    '@media (max-width: 600px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    // On mobile:

// Stack items vertically
// Align to left instead of center
});
