export const datePickerStyles = {
  flex: 1,
  minWidth: 0,
  "& input[type='date']": {
    paddingTop: "10px",
  },
};

export const selectStyles = {
  flex: 1,
  minWidth: 0,
  "& .MuiInputBase-root": {
    height: "56px",
  },
};

export const dateLabelStyles = {
  shrink: true,
  sx: { color: "#333" },
};

export const buttonStyles = {
  backgroundColor: "red",
  minWidth: { xs: "100%", md: "160px" },  // full width button on mobile
  height: "56px",
  whiteSpace: "nowrap",
  flexShrink: 0,
  px: 2,
  "&:hover": {
    backgroundColor: "darkred",
  },
};

// Shared width wrapper — title + form same width
export const heroOverlayStyles = {
  width: { xs: "92%", sm: "85%", md: "900px" },  // mobile: narrower
  maxWidth: "900px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignSelf: "flex-start",           // stick to left, not center
  pt: { xs: 2, md: 3 },
  pb: { xs: 2, md: 3 },
  pl: { xs: 2, sm: 3, md: 4 },       // left space on ALL screens
  pr: { xs: 2, sm: 2, md: 0 },
};

export const titleTextStyles = {
  title: {
    fontWeight: "bold",
    fontSize: { xs: "1.4rem", md: "1.75rem" },
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: { xs: "1rem", md: "1.15rem" },
    lineHeight: 1.4,
    mt: 1,
  },
};

export const formContainerStyles = (isSmallScreen) => ({
  display: "flex",
  alignItems: isSmallScreen ? "stretch" : "flex-end",
  gap: 1.5,
  flexDirection: isSmallScreen ? "column" : "row",
  width: "100%",
});