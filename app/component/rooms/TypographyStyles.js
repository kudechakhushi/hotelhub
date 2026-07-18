export const headingStyles = {
    fontWeight: 900,
    fontSize: { xs: "2.2rem", md: "3rem" },
    // xs (mobile) → 2.2rem
// md (tablet/desktop) → 3rem
    letterSpacing: { xs: "-0.5px", md: "-1.5px" },
    // Reduces space between letters.
    background: "linear-gradient(90deg,rgb(235, 18, 36) 0%,rgb(240, 4, 24) 50%, #2B86C5 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    position: "relative",
    display: "inline-block",
    cursor: "default",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    // Smooth animation for all changes.
    "&:hover": {
        // Smooth animation for all changes.
        transform: "scale(1.03)",
        letterSpacing: { xs: "0px", md: "-0.5px" },
        "&::after": {
            width: "100%",
            left: 0,
        },
    },
    "&::after": {
        // Expands underline (defined below).
// Moves it from center → full width.
        content: '""',
        position: "absolute",
        bottom: -8,
        left: "50%",
        width: 0,
        height: 4,
        background: "linear-gradient(90deg, #FF3CAC 0%,rgb(231, 16, 9) 100%)",
        borderRadius: 2,
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    "&:active": {
        // When clicked:
// Slight shrink (press effect)
        transform: "scale(0.98)",
    },
};