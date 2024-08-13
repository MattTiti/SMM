import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Expense from "@/models/Expense";

export async function PUT(req) {
  await connectMongo();

  try {
    const { userId, expenses } = await req.json();

    if (!userId || !expenses || !Array.isArray(expenses)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Find the user's existing expenses and update them with the new list
    const result = await Expense.findOneAndUpdate(
      { userId }, // Find by userId
      { expenses }, // Replace expenses with the new list
      { new: true, upsert: true } // Create if doesn't exist and return the new document
    );

    return NextResponse.json(
      { message: "Expenses saved successfully!", data: result },
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
