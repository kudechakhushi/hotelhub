"use server";
// This file or function runs ONLY on the server, not in browser.
// Your API key (GOOGLE_API_KEY) is sensitive.
// If this runs on frontend → key gets exposed → security disaster
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Give me the Gemini AI class from Google’s library”
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// new GoogleGenerativeAI(...)
// Creating an instance (object) of the AI client
// Connects your app to Google Gemini using your API key
export async function runAi(prompt) {
    // async → allows use of await This function takes input text and sends it to AI
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is missing in .env");
    }
  
    // getGenerativeModel() → selects AI model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
    });
    // generateContent(prompt) → sends request to AI
    // await → waits for response
//     Your prompt → sent to Google server
// Model processes it
// Response generated
// Output:
// result is NOT text → it's a structured object
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // result → response → text You extract actual response layer

    return response.text();
    // response.text() → converts response into plain string
  }

//   Step 1:
// Frontend calls:
// runAi("Suggest hotel names")
//  Step 2:
// Runs on server ("use server")
//  Step 3:
// Checks if API key exists
//  If missing → throws error → stops
//  Step 4:
// Gemini client already initialized (flawed order, but still works)
//  Step 5:
// Model selected:
// gemini-3.5-flash
//  Step 6:

// Prompt sent:

// "Suggest hotel names"
// Step 7:

// Google processes request

//  Step 8:

// Response received:

// result → response → text
//  Step 9:

// Returns final string:

// "Here are some hotel name ideas..."