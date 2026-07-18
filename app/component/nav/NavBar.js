// components/Navbar.js

import React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// Used for dropdown menu (mobile view)
import useMediaQuery from "@mui/material/useMediaQuery";
// Detects screen size (mobile or desktop)
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
// Navigation between pages (Next.js routing)
import Box from "@mui/material/Box";
import HotelHubLogo from "./HotelHubLogo";
const Navbar = () => {
    
    const [mounted, setMounted] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState(null);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    const showMobile = mounted && isMobile;

    const handleMenu = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    // What this actually does:
    // If menu is OPEN (anchorEl exists) → set null → CLOSE
    // If menu is CLOSED → store clicked button → OPEN
    //  event.currentTarget =the exact button you clicked (your menu icon)
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    // Converts value → true/false
    // null → false → menu closed
    // element → true → menu open

    const navLinks = ["About", "Restaurants", "Gallery", "AllBlogs", "AllRooms", "Contact"];
    return (
        <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
        }}
      >
            {/* Creates the top navbar position="static" → stays in normal flow (not fixed)
          styling → white background, black text */}
            <Box
                sx={{
                    margin: "0 auto",
                    width: "80%",
                    maxWidth: "1070px",
                }}
            >
                {/* This is layout control margin: auto → center horizontally
               width: 80% → responsive width
             maxWidth → prevents stretching too wide */}
                <Toolbar>
                    {/* MUI component that gives:proper height spacing flex alignment */}
                    <Box
                        sx={{
                            display: "flex",
                            flexGrow: 1,
                            justifyContent: "space-between",
                            alignItems: "center",

                        }}
                    >
                        {/* his controls layout of:left (logo)right (menu or buttons)
Key:display: flex → horizontal layout space-between → pushes items to edges
alignItems: center → vertical center */}
                       {/* logo section */}
                        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                            <Link href="/" passHref>
                                <Box sx={{ display: "flex", alignItems: "center" }} >
                                    <HotelHubLogo />
                                </Box>
                            </Link>
                        </Box>
                        {showMobile ? (
                            <>
                                <IconButton
                                    sx={{ zIndex: 1400 }}
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    {navLinks.map((link) => (
                                        <MenuItem key={link} onClick={handleClose}>
                                            {/* key={link} → required by React for lists
                                            onClick={handleClose} → closes menu when item clicked */}
                                            <Link href={`/${link.toLowerCase()}`} passHref>
                                            {/* Converts text → route
                                              Examples:
                                                 "About" → /about */}

                                                <Box
                                                    component="p"
                                                    sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
                                                >
                                                    {/* This is just styled textcomponent="p" → renders <p>
                                                    removes default link stylingbold text */}
                                                    {link}
                                                </Box>
                                            </Link>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {navLinks.map((link) => (
                                    <Button color="inherit" key={link}>
                                        <Link href={`/${link.toLowerCase()}`} passHref>
                                            <Box
                                                component="p"
                                                sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
                                            >
                                                {link}
                                            </Box>
                                        </Link>
                                    </Button>
                                ))}
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: "red",
                                        color: "white",
                                        marginLeft: "20px",
                                    }}
                                >
                                    Book Now
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default Navbar;