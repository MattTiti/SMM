import connectMongo from "@/libs/mongoose";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    // Parse the request body
    const body = await req.json();
    const { budgetNotifications, weeklyReports, monthlyReports } = body;

    console.log("budgetNotifications", budgetNotifications);
    console.log("weeklyReports", weeklyReports);
    console.log("monthlyReports", monthlyReports);

    const notification = await Notification.findOneAndUpdate(
      { userId: session.user.id },
      { budgetNotifications, weeklyReports, monthlyReports },
      { upsert: true, new: true }
    );
    console.log("updated notification", notification);

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const notification = await Notification.findOne({
      userId: session.user.id,
    });
    if (!notification) {
      return NextResponse.json({
        success: false,
        message: "Notifications not found",
      });
    }
    console.log("get notification", notification);
    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
