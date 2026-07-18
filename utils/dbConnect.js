

// Importing the mongoose library for interacting with MongoDB
import mongoose from "mongoose";

// Defining an asynchronous function to connect to the MongoDB database
//Why async:Database connection takes time → it’s not instant
const dbConnect = async () => {
  // Checking if Mongoose is already connected (readyState >= 1 means connected or connecting)
  if (mongoose.connection.readyState >= 1) {
    return; // If already connected, exit the function
  }
  //Why:Debugging → checking if .env is working
  // Logging the database URI to check if it's correctly loaded from environment variables
  console.log("====>", process.env.DB_URI);
// if we want to use any .env var than we have to use process.env.VAR_NAME
  // Attempting to establish a connection to MongoDB using the provided connection string
  await mongoose.connect(process.env.DB_URI);
};

// Exporting the dbConnect function so it can be used in other parts of the application
export default dbConnect;




























// import mongoose from "mongoose";


// const dbConnect = async () => {
//   if (mongoose.connection.readyState >= 1) {
//     return
//   }
//   console.log("====>", process.env.DB_URI)
//   await mongoose.connect(process.env.DB_URI)

// }


// export default dbConnect