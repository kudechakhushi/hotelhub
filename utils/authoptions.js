// Enables custom login (email/phone + password)
import CredentialsProvider from "next-auth/providers/credentials";
// Enables Google OAuth login
// 👉 This is NOT your logic — Google handles authentication
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/model/user";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  // No session stored in DB
// Everything stored in JWT token (cookie)
// Login → JWT created → stored in cookie → reused on every request
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const { email, phone, password } = credentials;
        // Extract data sent from frontend
        if (!email && !phone) {
          throw new Error("Email or phone number is required");
        }

        if (!password) {
          throw new Error("Password is required");
        }

        const query = email
          ? { email }
          : { mobileNumber: phone };

        const user = await User.findOne(query);
        // MongoDB lookup Fetch user
        if (!user?.password) {
          // user doesn't exist OR
// user signed up with Google (no password)
          throw new Error("Please login via the method used to sign up");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        // This is the user object you are handing to NextAuth after login success.
        // This is the source of truth for the logged-in user.
//         Which means:User enters login → you verify → THIS gets returned
// ⚙️ What happens after this return
// return user object
//         ↓
// NextAuth receives it
//         ↓
// Stored inside JWT (token.user)
//         ↓
// Copied into session (session.user)
//         ↓
// Frontend can access it
        return {
          id: user._id.toString(),
          // MongoDB stores _id as an ObjectIdJWT can't store ObjectId properly frontend expects string
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role || "user",
          image: user.image || null,
//           This is what enables:
// if (session.user.role === "admin") Without this → no role-based access control
        };
      },
    }),
    // This is what enables “Login with Google”

    // clientId & clientSecret come from Google Cloud
    // When user clicks signIn("google"), this provider:
    // redirects user to Google
    // shows their Gmail accounts
    // handles authentication
//     When you call:

// signIn("google")

// NextAuth does:

// 👉 “Find provider with id = google”

// It finds:

// GoogleProvider(...)

// ✔ Match found → use Google auth flow
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Runs right after user logs in successfully
      await dbConnect();


      if (account?.provider === "google") {

        const existingUser = await User.findOne({ email: user.email });
        // Check if this Google user already exists in your DB

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        }
      }

      return true;
    },
    // After login → user goes to homepage /
    async redirect({ baseUrl }) {
      return `${baseUrl}/`;
    },
    // his controls what goes inside the JWT (auth token)
    async jwt({ token, user }) {
      await dbConnect();
      // You are attaching user data into token user here comes from provider (Google or credentials)
// Google DOES NOT give phoneNumber or role
// → so those will be undefined
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role || "user",
          image: user.image || null,
        };
        return token;
      }
      // If token has an email, then we can identify the user”
      if (token?.email) {
        const dbUser = await User.findOne({ email: token.email });
        // “Go to database and find full user using email” Because token only has LIMITED info
        // But database has FULL info:
        if (dbUser) {
          // f user exists in DB, attach full data to token”
          token.user = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            mobileNumber: dbUser.mobileNumber,
            role: dbUser.role || "user",
            image: dbUser.image || null,
          };
        }
      }

      return token;
    },
    // This runs when frontend asks: useSession()
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
        // “Take user data from token and send it to frontend”
      }
      return session;
//       User logs in
// Token gets email
// You fetch user from DB
// Add full data into token
// Session sends that to frontend
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  // se this secret key to secure authentication”
//   NextAuth creates a JWT token (login identity)
// That token must be signed (locked) so no one can fake it

// 👉 This secret is the lock key
  pages: {
    signIn: "/login",
  },
  // When login is needed, send user to /login page”
};