import { withAuth } from "next-auth/middleware";
// This is a helper from NextAuth
import { NextResponse } from "next/server";
// Used to return responses in middleware
// Especially:redirect() rewrite()
export default withAuth(
    // Middleware runs only if authorized() passes
  function middleware(req) {
    const url = req.nextUrl.pathname;
    // Gets current path
    const token = req.nextauth?.token;
    // Gets JWT token from NextAuth If user is logged in → token exists
    const userRole = token?.user?.role;
    // Extracts user role from token

    if (url.includes("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    //   Redirects user to homepage
    }

    if (url.includes("/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // No token = not logged in → redirect to login
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    //   If user is NOT logged in: redirect to /login
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/admin",
    "/dashboard/admin/:path*",
    "/dashboard/user",
    "/dashboard/user/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};