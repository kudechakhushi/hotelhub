"use client";
import { ToastContainer } from 'react-toastify';
import {usePathname} from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topnav from "./component/nav/topnav";
import {SessionProvider} from "next-auth/react";
import Navbar from "./component/nav/NavBar";
import { store } from "./store";
import { Provider } from "react-redux";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname==="/dashboard/admin";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      
      <body>
        
        <SessionProvider> 
        {/*  provideIt connects your React app to Redux
Without it:
useSelector() → ❌ error */}
{/* useDispatch() → ❌ error */}

        <Provider store={store}>
          <ToastContainer />
          {!isDashboard && (
            <>
        <Topnav />
        <Navbar />
       
        </>
        )}
         {children}
         </Provider>
        </SessionProvider>
        
      </body>
     
    </html>
  );
}

// Store is created
// configureStore(...)
// Step 2: Store is given to React
// <Provider store={store}>
// Step 3: Components access it
// useSelector()
// useDispatch()
// Step 4: Actions update store
// dispatch(fetchBlogPosts())
// Step 5: UI updates automatically