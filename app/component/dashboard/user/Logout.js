"use client";
import { signOut } from "next-auth/react";
// What it does:
// Clears session (cookies / JWT)
// Logs user out from NextAuth
// Can redirect after logout
import { Button, Box } from "@mui/material";

export default function LogOut() {
  const handleLogout = async () => {
     await signOut({ callbackUrl: "/" });
//     NextAuth destroys session
// Removes cookies
// User becomes unauthenticated
// Redirects to / (homepage)
  };

  return (
    <>
     <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
  }}
>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleLogout}
        >
Logout


        </Button>
      </Box>
    </>
  );
}