import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function POST(req) {
  console.log("Start free trial API route called");

  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Authorized user:", session.user.email);

  try {
    await connectMongo();
    console.log("Connected to MongoDB");

    const { userId } = await req.json();
    console.log("Received userId:", userId);

    let user = await User.findById(userId);

    if (!user) {
      console.log("User not found for ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Found user:", user.toObject());

    // Check if user has ever had a trial
    if (user.trialStart || user.trialEnd) {
      console.log("User has already used their trial");
      return NextResponse.json(
        { error: "User has already used their free trial" },
        { status: 400 }
      );
    }

    // Set trial start and end time
    const now = new Date();
    user.trialStart = now;
    user.trialEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now
    user.hasAccess = true;

    console.log("User before save:", user.toObject());

    await user.save();

    // Fetch the user again to verify the changes
    user = await User.findById(userId);
    console.log("User after save:", user.toObject());

    return NextResponse.json({
      message: "Free trial started successfully",
      trialEnd: user.trialEnd,
    });
  } catch (error) {
    console.error("Error starting free trial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
