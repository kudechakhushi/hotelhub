"use client";
import React, { useEffect, useRef } from "react";
// useRef → persistent variable that does NOT trigger re-render
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Success = () => {
  const router = useRouter();
//   Enables navigation like router.push()
  const hasRunRef = useRef(false);
//   Prevents your logic from running multiple times
  useEffect(() => {
    if (hasRunRef.current) return;
    // If already executed → stop
    hasRunRef.current = true;
//Mark as executed
    const varifyPayment = async () => {
      if (typeof window !== "undefined") {
        // Ensures you're in browser
        const query = new URLSearchParams(window.location.search);
        // Extracts query params from URL
        const sessionId = query.get("session_id");
        // Gets Stripe session ID
        if (sessionId) {
          try {
            const response = await fetch(
              `/api/user/payment/stripepayment/stripeverify/${sessionId}`
            //   Calls your backend API
            );

            const data = await response.json();
            // Parse response
            if (!response.ok) {
              toast.error(data?.err);

              router.push("/dashboard/user/cancel");
            } else {
              toast.success(data?.success);
              router.push("/dashboard/user");
            }
          } catch (error) {
            router.push("/dashboard/user/cancel");
          }
        }
      }
    };

    varifyPayment();
  }, [router]);
//   Only reruns if router changes

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
// FULL FLOW (NO BULLSH*T VERSION)
// Step-by-step reality:
// User pays via Stripe Checkout

// Stripe redirects to:

// /success?session_id=xyz
// This page loads
// useEffect runs once

// It extracts:

// session_id

// Calls your backend:

// /api/.../stripeverify/:sessionId
// Backend:
// Talks to Stripe
// Checks if payment = paid
// Updates booking
// Frontend receives response