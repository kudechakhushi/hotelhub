// import { useState, useEffect, Suspense } from "react";

// import HotelDetails from "@/component/Bookingdetails/BookingComponent";

// import { useSearchParams } from "next/navigation";
// export const dynamic = "force-dynamic";

// const ContentViewPage = () => {
//   const [content, setContent] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const searchParams = useSearchParams();

//   const search = searchParams.get("search");

//   useEffect(() => {
//     if (!search) return;

//     const fetchContent = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           `${process.env.API}/getsingleroom/${search}`
//         );

//         if (!response.ok) {
//           throw new Error("failed to  fetch content");
//         }

//         const data = await response.json();

//         setContent(data);
//       } catch (error) {
//         setError(error.message || "an error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContent();
//   }, [search]);

//   if (error) {
//     return <p>Error {error}</p>;
//   }

//   return (
//     <>
//       <HotelDetails
//         content={content}
//         loading={loading}
//         setLoading={setLoading}
//       />
//     </>
//   );
// };

// export default ContentViewPage;



'use client';

import { Suspense, useState, useEffect } from 'react';
// Suspense → handle async loading UI
import { useSearchParams } from 'next/navigation';
// Used to read URL query params like:
import HotelDetails from '@/app/component/Bookingdetails/BookingComponent';

export const dynamic = 'force-dynamic';
// Tells Next.js:
// Don’t cache this page
// Always fetch fresh data

// 1️⃣ Child component using useSearchParams
function BookingContentFetcher() {
  const [content, setContent] = useState(null);
//   Stores API response (room data)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
//   Get query parameter
  const search = searchParams.get("search");
//   /booking?search=abc123
// 👉 search = "abc123"

  useEffect(() => {
    if (!search) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/getsingleroom/${search}`);
        // Calls your backend API
        if (!response.ok) throw new Error("Failed to fetch content");
        const data = await response.json();
        setContent(data);
        // Store data
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [search]);
//   Re-run when search changes
  if (error) return <p>Error: {error}</p>;

  return (
    <HotelDetails
      content={content}
      loading={loading}
      setLoading={setLoading}
    />
  );
}

// 2️⃣ Main page component that wraps the fetcher in Suspense
const ContentViewPage = () => {
  return (
    <Suspense fallback={<p>Loading booking details...</p>}>
      <BookingContentFetcher />
    </Suspense>
  );
};

export default ContentViewPage;

// STEP 1: User opens URL
// /booking?search=abc123
// 🟡 STEP 2: Page loads
// ContentViewPage renders
// Suspense wraps component
// 🟠 STEP 3: BookingContentFetcher runs
// search = "abc123"
// 🔵 STEP 4: useEffect triggers
// fetch(`/api/getsingleroom/abc123`)
// 🟣 STEP 5: Backend API runs
// Finds room by ID
// Returns room data
// 🟤 STEP 6: Frontend updates state
// setContent(data)
// setLoading(false)
// ⚫ STEP 7: UI renders
// <HotelDetails content={data} />

// 👉 Now your booking page appears