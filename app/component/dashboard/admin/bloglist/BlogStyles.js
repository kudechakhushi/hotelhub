import { styled } from "@mui/material/styles";

import {
  Box,
  Typography,
  IconButton,
  Container,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
// You’re creating a custom version of <Container>
export const StyledContainer = styled(Container)(({ theme }) => ({
  py: 4,
//   Applies styles when screen ≥ medium (md)
  [theme.breakpoints.up("md")]: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
//   Makes card stretch fully and behave like a column layout
  transition: "transform 0.3s, box-shadow 0.3s",
//   Smooth animation for hover
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
//   On hover:moves up slightlyadds shadow
}));

export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: "cover",
  cursor: "pointer",
  transition: "opacity 0.3s",
  "&:hover": {
    opacity: 0.9,
  },
//   Slight fade on hover
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
//   Makes content fill available space
  "& > *:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
//   Targets all children except last
// Adds spacing between elements
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  transition: "color 0.3s",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
  },
//   On hover:
// changes color
// adds underline
}));

export const StyledChipContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
//   Horizontal layout with spacing between items
}));

export const StyledActionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
//   Adds top border → separates actions visually
}));

export const StyledReadMore = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  transition: "color 0.3s",
  "&:hover": {
    color: theme.palette.primary.dark,
    textDecoration: "underline",
    // Hover effect → link-like behavior
  },
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
//   Subtle hover background effect
}));