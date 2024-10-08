import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const month = req.nextUrl.searchParams.get("month");
  const year = req.nextUrl.searchParams.get("year");

  if (!userId || !month || !year) {
    return NextResponse.json(
      { error: "User ID and Month are required" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    // Fetch expenses for the user and month
    const monthlyExpenses = await Expense.find({ userId, month, year }).lean();
    const allExpenses = await Expense.find({ userId, year }).lean();

    return NextResponse.json({ monthlyExpenses, allExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Error fetching expenses" },
      { status: 500 }
    );
  }
}
