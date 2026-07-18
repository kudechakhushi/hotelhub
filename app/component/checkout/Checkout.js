import { useState, useEffect } from "react";
// useState → store data (state)
// useEffect → run side effects (like API calls)
import { Container, Grid, Box, CircularProgress } from "@mui/material";
// CircularProgress → loader
import { useSession } from "next-auth/react";
// Gets logged-in user session
import BillingDetails from "./BillingDetails";
 import BookingSummary from "./BookingSummary";
import PaymentGateways from "./PaymentGateways"; // Import the separated component
import { toast } from "react-toastify";
// For notifications
import { useRouter } from "next/navigation";
// Used to redirect pages
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [pricingData, setPricingData] = useState(null);

  const { data } = useSession();
  // Logged-in user data
  const router = useRouter();
  // Used to redirect pages
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensures code runs only in browser
      const params = new URLSearchParams(window.location.search);
      // Reads query params from URL
      const alldata = {
        roomId: params.get("roomId"),
        checkIn: params.get("checkIn"),
        checkOut: params.get("checkOut"),
        guests: parseInt(params.get("guests")),

        rooms: parseInt(params.get("rooms")),
      };
      // Extracts values from URL
      fetchPricingData(alldata);
      // Calls API to get pricing
    }
  }, []);

  const fetchPricingData = async (bookingData) => {
    try {
      const response = await fetch(`/api/user/checkoutdetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          rooms: bookingData.rooms,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to  fetch Pricing ");
      }

      const result = await response.json();

      setPricingData({
        pricePerNight: result.pricePerNight,
        nights: result.nights,
        subtotal: result.subtotal,
        discountPercent: result.discountPercent,
        discountAmount: result.discountAmount,
        total: result.total,
        rooms: result.rooms,
        guests: result.guests,
        roomTypeName: result.roomTypeName,
        room_id: result?.room_id,
        checkIn: result?.checkIn,
        checkOut: result?.checkOut,
        image: result.image,
      });
    } catch (error) {
      console.log(" error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    // Creates a new <script> tag in memory.
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    // Dynamically loads Razorpay SDK
    // Sets the script source (URL).
    script.async = true;
    // Loads script asynchronously
    // Loads in background
    const loadHandler = () => {
      console.log("Razorpay script loaded");
    };
    // Function that runs after script finishes loading.

    script.addEventListener("load", loadHandler);
    // Attaches the above function to the script’s load event.
    document.body.appendChild(script);
    // This actually starts downloading and executing Razorpay SDK.
    return () => {
      // Runs when component unmounts (page change
      script.removeEventListener("load", loadHandler);
      // Removes event listener to prevent memory leaks.
      document.body.removeChild(script);
      // Removes script from DOM.
    };
  }, []);

//   Page loads
//    ↓
// UI renders
//    ↓
// useEffect runs
//    ↓
// Script added to DOM
//    ↓
// SDK downloads
//    ↓
// window.Razorpay becomes available
//    ↓
// User clicks Pay
//    ↓
// Payment popup opens

  const handleRazorpay = async (orderData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/payment/razorpaypayment/razorpay`,
        // Calls your backend API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Sends booking + payment data to backend
          },
          body: JSON.stringify(orderData),
          // Converts API response into JS object
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err || "Payment failed");
        setLoading(false);
        return;
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        // Your public Razorpay key
        amount: data.amount, 
             // already in paise from Razorpay 
        currency: data.currency || "INR",
        // Default INR if not provided
        name: "Hotel hub",
        description: "Hotel booking payment",
        // Displayed in Razorpay popup
        order_id: data.id,
        // This connects payment with backend order
        handler: function (response) {
          verifyPayment(response.razorpay_payment_id);
          // Runs AFTER successful payment
// Calls your verify function
        },

        prefill: {
          name: data && data.name,
          email: data && data.email,
        },

        notes: {
          address: "your address",
        },
        theme: {
          color: "red",
        },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }
      

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
//       This works ONLY because:
// useEffect already loaded the script earlier
      setLoading(false);
    } catch (error) {
      console.log("error inintiating payment", error);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `/api/user/payment/razorpaypayment/razorpayverify`,
        // Calls backend to verify payment
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ razorpay_payment_id: paymentId }),
          // Sends payment ID to backend
        }
      );

      const data = await response.json();

      if (data?.err) {
        router.push("/cancel");
        setLoading(false);
      } else {
        toast.success(data?.success);
        router.push("/dashboard/user");

        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

//   User clicks Pay
//    ↓
// handleRazorpay runs
//    ↓
// Call backend → create order
//    ↓
// Get order_id + amount
//    ↓
// Create Razorpay options
//    ↓
// Open Razorpay popup
//    ↓
// User completes payment
//    ↓
// handler() triggers
//    ↓
// verifyPayment() runs
//    ↓
// Backend verifies payment
//    ↓
// Success → redirect dashboard
// Failure → redirect cancel

  const handleStripe = async (orderData) => {
    try {
      const response = await fetch(
        `/api/user/payment/stripepayment/stripe`,
        // Calls your backend API route.
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            // Tells backend you're sending JSON.
          },
          body: JSON.stringify(orderData),
          // Converts orderData into JSON string.
        }
      );

      const data = await response.json();
      // Parses backend response.
      if (!response.ok) {
        toast.error(data.err);
      } else {
        window.location.href = data.id;
        // Redirects user to Stripe Checkout page
// data.id is actually the checkout session URL
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePaypal = async (orderData) => {
    // Takes orderData → all booking + payment info
    try {
      const response = await fetch(
        `/api/user/payment/paypalpayment/paypal`,
        // This calls your backend API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
          // Converts orderData into JSON string
        }
      );
      // Converts backend response → JS object
      const data = await response.json();
      if (!response.ok) {
        toast.error("paypal payment failed");
      } else {
        window.location.href = data.id;
      }
    } catch (error) {
      console.log(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!billingDetails?.isValid) {
      const errorField = Object.entries(billingDetails?.data || {}).find(
        ([key, value]) => key !== "country" && (!value || value.trim() === "")
      );
      // Converts billing data into [key, value] pairs
      // Finds the first empty field
      // Ignores "country"
      if (errorField) {
        alert(`please fill in  ${errorField[0]}  correctly `);
      } else {
        alert("plese  fill in all required field  correctyl");
      }
      return;
    }

    if (!selectedPaymentMethod) {
      alert("please select a payment method");
      return;
    }

    const orderData = {
      ...pricingData,
      billingDetails: billingDetails.data,
      paymentMethod: selectedPaymentMethod,
    };
//     pricingData → room, price, dates
// billingDetails.data → user info
// paymentMethod → stripe / razorpay / paypa

    try {
      switch (selectedPaymentMethod.toLocaleLowerCase()) {
        case "stripe":
          await handleStripe(orderData);
          break;
        case "razorpay":
          await handleRazorpay(orderData);
          break;

        case "paypal":
          await handlePaypal(orderData);
          break;

        default:
          const response = await fetch(`/api/user/place-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          if (!response.ok) {
            const errordata = await response.json();
            throw new Error(errordata.message);
          }

          const result = await response.json();
          alert(`Order placed successfully`);
          router.push("/dashboard/user");
      }
    } catch (error) {
      alert(`order failed ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "black",
        }}
      >
        <CircularProgress
          size={80}
          sx={{
            color: "purple",
            animation: "spin 2s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
          <BillingDetails onBillingDetailsChange={setBillingDetails} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BookingSummary pricingData={pricingData} />
         <PaymentGateways
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            handlePlaceOrder={handlePlaceOrder}
          /> 
        </Grid>
      </Grid>
    </Container>
  );
}

//sb-rl43sf52020746@personal.example.com
// Page Load → Get URL data → Fetch pricing → Fill form →
// User selects payment → Validate → Create orderData →
// Call payment API → Redirect / Popup →
// Verify (only Razorpay) → Success / Fail redirect