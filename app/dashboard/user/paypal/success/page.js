"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// Used to navigate programmatically
import { Box, Typography, Button } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Success = () => {
  const router = useRouter();

  const hasRunRef = useRef(false);
//   A flag to prevent double execution
  useEffect(() => {
    if (hasRunRef.current) return;
    // hasRunRef is a mutable reference created with useRef(false)
//     This line checks:
// “Did this effect already run before?”
// If the answer is yes (true), it immediately exits the useEffect.
    hasRunRef.current = true;
    // This sets the flag to true after the first run
    const verifyPayment = async () => {
      if (typeof window === "undefined") return;
    //   Prevents server-side execution
      const query = new URLSearchParams(window.location.search);
    //   window.location.search
// This gives you the query string from the URL.
      const token = query.get("token");
    //   Extracts the value of token from URL
      if (!token) {
        router.push("/dashboard/user/paypal/cancel");
        return;
      }
  
      try {
        const response = await fetch(
          `/api/user/payment/paypalpayment/paypalvarify/${token}`
        );
        // Calls your API
// Sends token for verification
        const data = await response.json();
        // Converts response to JSON
        if (!response.ok) {
          console.log("verify failed", data);
          router.push("/dashboard/user/paypal/cancel");
        } else {
          router.push("/dashboard/user");
        }
      } catch (error) {
        console.log("error", error);
        router.push("/dashboard/user/paypal/cancel");
      }
    };
  
    verifyPayment();
  }, [router]);

  return (
    <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  }}
>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheckCircle color="#4caf50" size="120" />
      </motion.div>
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for your subscription. Now Everything is free.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        onClick={() => router.push("/dashboard/user")}
        sx={{
          bgcolor: "purple",
          ":hover": { bgcolor: "darkviolet" },
          whiteSpace: "nowrap",
          padding: "12px 44px",
          fontSize: "1.6rem",
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Success;

// Extract PayPal token from URL
// Send token to backend
// Backend verifies payment
// If success → dashboard
// If failure → cancel page