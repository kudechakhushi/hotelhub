import NextAuth from "next-auth";
// “Bring the NextAuth function so we can create auth API”
// It’s a function that:
// // handles login
// creates tokens
// manages sessions
// handles OAuth (Google, etc.)
import {authOptions} from "@/utils/authoptions";

const handler = NextAuth(authOptions);
// Create an API handler using my auth config”
export { handler as GET, handler as POST };
// Use this handler for both GET and POST requests”