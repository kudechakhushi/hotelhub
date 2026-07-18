"use client";
// Forces this file to run on the browser (client-side) in Next.js.
import React, { useEffect, useState } from "react";

import { styled, useTheme, useMediaQuery, Divider } from "@mui/material";
import { Tabs, Tab, Box, Avatar } from "@mui/material";
import {
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import Dashboard from "./Dashboard";
import PersonolInfo from "./PersonolInfo.js";
import Booking from "./Booking";
import ChangePassword from "./ChangePassword";

import LogOut from "./Logout";
// You’re customizing <Avatar />
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "250px",
  height: "250px",
  margin: "auto",
  border: "5px solid red",
  borderRadius: "50%",
  marginBottom: "16px",
  marginTop: "36px",
  transition: "transform 0.2s ease-in-out",
  transform: "scale(1.2)",
  "&:hover": {
    animation: "moveLeftRight 1s infinite",
    // On hover → it shakes left/right
  },
  "@keyframes moveLeftRight": {
    "0%": {
       transform: "translateX(0)",
    //   At the start:
// position = original (no movement)
    },
    "50%": {
      transform: "translateX(20px)",
    //   At halfway point:

// move 20px to the right
    },
    "100%": {
      transform: "translateX(0)",
    //   At the end:go back to original position
    },
  },
}));

const StyledDivider = styled("div")(({ theme }) => ({
  width: "100%", // full width
  height: "5px", // height of the divider
  background:
    "linear-gradient(45deg,  #ff6666, #ff8080, #ff9999,  #ffcccc, #ffb3b3, #002bff, #ff3333, #ff4d4d)",
//     This is the important part.

// linear-gradient = multiple colors blended
// 45deg = angle
// colors = sequence of shades

// 👉 Result: rainbow-like strip
  backgroundSize: "400% 400%",
  animation: "gradientBorder 5s ease infinite",
//   Runs animation:

// gradientBorder → name
// 5s → duration
// ease → smooth motion
// infinite → loop forever
  "@keyframes gradientBorder": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));
// Styled components
const Root = styled("div")(({ theme }) => ({
  display: "flex",
//   Enables flexbox layout
  flexDirection: "column", 
//   default layout = vertical
  height: "100vh",
//   Full screen height
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
//   This is critical.sm = small screens (~600px+)
// up("sm") = apply on tablets/desktops
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
//   Adds vertical line on right side
  borderBottom: `6px solid ${theme.palette.divider}`,
//   Adds thick bottom border

//   On small screens (mobile):
  [theme.breakpoints.down("sm")]: {
//   Remove vertical line
    borderRight: "none",
//   Keep bottom border
    borderBottom: `6px solid ${theme.palette.divider}`,
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  flexGrow: 5,
//   Takes remaining space in layout
  padding: theme.spacing(2),
//   Adds spacing (usually 16px)
}));
// Centers icon perfectly
const TabIconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

function VerticalTabs() {
  const [value, setValue] = React.useState(0);
//   value = which tab is active
//   setValue = function to change active tab
//   Default = 0 → first tab (Dashboard)
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [profileImagePreview, setProfileImagePreview] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/profile`);

      if (!response.ok) {
        throw new Error("failed to fetch user data");
      }

      const data = await response.json();

      setProfileImagePreview(data?.image);
    } catch (error) {
      console.log("error fetching user data", error);
    }
  };
//   Ensures code runs only in browser (not server)
//   👉 Necessary in Next.js
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storeValue = localStorage.getItem("activeTab");
    //   Get previously saved tab

      if (storeValue) {
        setValue(parseInt(storeValue, 10));
        // Convert string → number
// Restore last active tab without this tab reset every refresh
      }
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Update active tab every time user clicks a tab
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", newValue);
    //   Saves tab to localStorage
// 👉 This is how persistence works
    }
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: "80%",
        maxWidth: "1370px",
      }}
    >
      <StyledAvatar
        alt="User"
        src={profileImagePreview || "/images/pic1.png"}
      />

      <StyledDivider />

      <Root>
        <StyledTabs
          orientation={isSmallScreen ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            flexGrow: isSmallScreen ? 0 : 1,
          }}
        >
          <Tab
            icon={<HomeIcon />}
            label="Dashboard"
            iconPosition="start"
            sx={{
              backgroundColor: value === 0 ? "#ffcccc" : "inherit",
              borderBottom: value === 0 ? "2px solid red" : "none",

              color: "red",
              "&:hover": {
                color: "red",
              },
            }}
          />
          <Tab
            icon={<InfoIcon />}
            label="Personol Info "
            iconPosition="start"
            sx={{
              backgroundColor: value === 1 ? "#ffcccc" : "inherit",
              borderBottom: value === 1 ? "2px solid red" : "none",

              color: "red",
              "&:hover": {
                color: "red",
              },
            }}
          />
          <Tab
            icon={<ContactMailIcon />}
            label="ChgangePassword"
            iconPosition="start"
            sx={{
              backgroundColor: value === 2 ? "#ffcccc" : "inherit",
              borderBottom: value === 2 ? "2px solid red" : "none",

              color: "red",
              "&:hover": {
                color: "red",
              },
            }}
          />
          <Tab
            icon={<SettingsIcon />}
            label="Booking Details"
            iconPosition="start"
            sx={{
              backgroundColor: value === 3 ? "#ffcccc" : "inherit",
              borderBottom: value === 3 ? "2px solid red" : "none",

              color: "red",
              "&:hover": {
                color: "red",
              },
            }}
          />
          <Tab
            icon={<PersonIcon />}
            label="Logout"
            iconPosition="start"
            sx={{
              backgroundColor: value === 4 ? "#ffcccc" : "inherit",
              borderBottom: value === 4 ? "2px solid red" : "none",

              color: "red",
              "&:hover": {
                color: "red",
              },
            }}
          />
        </StyledTabs>
        <TabPanel>
          {value === 0 && (
            <div>
          
                <Dashboard />
          
            </div>
          )}

          {value === 1 && (
            <div>
        
                <PersonolInfo />
         
            </div>
          )}

          {value === 2 && (
            <div>
              <ChangePassword />
            </div>
          )}

          {value === 3 && (
            <div>
              <Booking/>
            </div>
          )}

          {value === 4 && (
            <div>
              <LogOut />
            </div>
          )}
        </TabPanel>
      </Root>
    </Box>
  );
}

export default VerticalTabs;