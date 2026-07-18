// Used to return responses in API routes for admin side Server side (backend)
import { NextResponse } from "next/server";
// Used to send response back (like res.json() in Express)
import dbConnect from "@/utils/dbConnect";
import BookArea from "@/app/model/bookarea";

export async function GET(req) {
  await dbConnect();
  try {
    let promo = await BookArea.findOne();
    // Gets ONE document from collection

    if (!promo) {
      promo = {
        shortTitle: "",
        mainTital: "",
        shortDesc: "",
        linkUrl: "",

        photoUrl: "",
        // Instead of returning null, you return empty structure
      };
    }

    return NextResponse.json(promo);
    // Sends data to frontend
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
// calls GET API
// → DB fetches data
// → returns promo
// → UI fills form

export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const { shortTitle, mainTital, shortDesc, linkUrl, photoUrl } = body;
    // Extract fields
    let promo = await BookArea.findOne();
    // Finds ONE document
    if (promo) {
      promo.shortTitle = shortTitle,
        promo.mainTital = mainTital,
        promo.shortDesc = shortDesc,
        promo.linkUrl = linkUrl,
        promo.photoUrl = photoUrl,
        // Overwrites old data
      await promo.save();
    } else {
      promo = await BookArea.create({
        shortTitle,
        mainTital,
        shortDesc,
        linkUrl,
        photoUrl,
      });
    }

    return NextResponse.json({ message: "Promo updated successfullu", promo });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
// User clicks submit
// → handleSubmit runs (frontend)
// → sends PUT request
// → THIS function runs (backend)
// → updates MongoDB
// → returns success
// → frontend shows message