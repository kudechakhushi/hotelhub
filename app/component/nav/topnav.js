"use client";
// Run this component on the browser (client side)”
// Next.js by default uses server components.
// But hooks like:
// useState
// useMediaQuery
//  ONLY work on client

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import {useSession} from "next-auth/react";
import ListItem from "@mui/material/ListItem";
import { useRouter } from "next/navigation";
import Link from "next/link";
// If you use Link:

// smooth navigation ✅

const Navbar = () => { // ✅ Functional component
  const theme = useTheme(); // ✅ Get the current theme
  //  Without this, you’d be guessing screen sizes like "600px" — which is dumb
  //  because MUI already defines them.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //Checks: “Is the screen size small or below (mobile)?” Why you use it To make your UI responsive.
  // If true → mobile screen
  // If false → tablet/desktop
const {data: session} = useSession();
// It asks NextAuth:“Give me current logged-in user data”
const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // useState is used to store and update data inside a component, and make the UI react to that data.

  // ✅ Correct toggle function
  // simple toggle function
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
//   Meaning:“If admin → go to admin dashboard
// else → user dashboard”
  const handleClick = () => {
    router.push(`/dashboard/${session?.user?.role === "admin" ? "admin" : "user"}`);
  };
  // ✅ Drawer content (clean)
  // you are storing UI (JSX) inside a variable called drawer
  const drawer = (
    <Box sx={{ width: 250 }}>
      {/* A container (like <div>) */}
      <List>
        {/* A list container (like <ul>) */}
        <ListItem>
          <LanguageIcon sx={{ mr: 1 }} />
          {/* A globe icon
          Why
          Visual indicator for language
          mr: 1 = margin-right (space) */}
          <Select
            value="English"
            variant="standard"
            disableUnderline
            sx={{ color: "black" }}
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
          </Select>
        </ListItem>

        <ListItem>
          <Button
            component={Link}
            href="/login"
            startIcon={<AccountCircleIcon />}
          >
            Login
          </Button>
        </ListItem>

        <ListItem>
          <Button
            component={Link}
            href="/register"
            startIcon={<AccountCircleIcon />}
          >
            Register
          </Button>
        </ListItem>
      </List>
    </Box>
  );
  // ou are building TWO DIFFERENT layouts

  // Mobile → Drawer
  // Desktop → Navbar
  return (
    <AppBar position="static" sx={{ backgroundColor: "red" }}>
      {/* A navbar container (top bar)
         Why use it
         MUI gives you a pre-built navbar instead of making one from scratch.
         position="static" → stays in normal flow (doesn’t stick)
        sx={{ backgroundColor: "red" }} → styling (red background) */}
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* A layout helper inside AppBar What it does aligns items properly
             space-between → pushes left content to left, right content to right */}
        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* display: flex → makes items horizontal
alignItems: center → vertically center them */}
          <LanguageIcon sx={{ mr: 1 }} />
          <Select
            value="English"
            variant="standard"
            disableUnderline
            sx={{ color: "white" }}
          >
            {/* isableUnderline  removes underline styling
               sx={{ color: "white" }}  makes text white */}
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="French">French</MenuItem>
            <MenuItem value="German">German</MenuItem>
          </Select>
        </Box>

        {/* RIGHT SECTION */}
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleDrawer}
            >
              <MenuIcon />
              {/* hamburger icon (☰) */}
            </IconButton>

            <Drawer open={drawerOpen} onClose={toggleDrawer}>
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

            <HomeIcon />
            <Typography sx={{ color: "white" }}>
              "The Yolk's On You Manor"
            </Typography>

            <PhoneIcon />
            <Typography sx={{ color: "white" }}>
              +1 222-363-5354
            </Typography>

            {/* ✅ FIXED IMAGE */}
            {session?.user ? (
              // “If user exists → show profile image”
  <img
    onClick={handleClick}
    src={session?.user?.image || "/images/image2.jpg"}
    alt="User Avatar"
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
    }}
  />
) : (
  <>
    <Button
      component={Link}
      href="/login"
      color="inherit"
      startIcon={<AccountCircleIcon />}
    >
      Login
    </Button>

    <Button
      component={Link}
      href="/register"
      color="inherit"
      startIcon={<AccountCircleIcon />}
    >
      Register
    </Button>
  </>
)}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;