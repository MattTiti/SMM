import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasToken = !!user.plaidAccessToken;

    return NextResponse.json({ hasToken });
  } catch (error) {
    console.error("Error checking Plaid token:", error);
    return NextResponse.json(
      { error: "Failed to check Plaid token" },
      { status: 500 }
    );
  }
}
