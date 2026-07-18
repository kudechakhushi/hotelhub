import { styled } from "@mui/system";
import { Box } from "@mui/material";

export const BackgroundContainer = styled("div")({
  backgroundImage: "url(/images/hotel9.jpg)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  width: "100%",
  height: "calc(100vh - 120px)",
  margin: 0,
  padding: 0,
  position: "relative",
});

export const TransparentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: "16px 20px",
  borderRadius: "4px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "12px 14px",
  },
}));

export const TransparentBoxx = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "4px",
  color: "black",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "14px 16px",
  },
}));