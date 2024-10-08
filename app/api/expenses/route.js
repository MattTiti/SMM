import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Expense from "@/models/Expense";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  await connectMongo();

  try {
    const { month, year, budget, expenses } = await req.json();

    if (
      !userId ||
      !month ||
      !budget ||
      !expenses ||
      !year ||
      !Array.isArray(expenses)
    ) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Find the user's existing expenses for the selected month and update them with the new list and budget
    const result = await Expense.findOneAndUpdate(
      { userId, month, year }, // Find by userId, month, and year
      { budget, expenses }, // Replace expenses and budget with the new data
      { new: true, upsert: true } // Create if doesn't exist and return the new document
    );

    return NextResponse.json(
      { message: "Expenses and budget saved successfully!", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving expenses:", error);
    return NextResponse.json(
      { message: "Error saving expenses", error: error.message },
      { status: 500 }
    );
  }
}
