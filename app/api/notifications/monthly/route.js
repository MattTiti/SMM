import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Expense from "@/models/Expense";
import { sendEmail } from "@/libs/mailgun";

export async function GET() {
  await connectMongo();

  try {
    const notifications = await Notification.find({ monthlyReports: true });

    for (const notification of notifications) {
      const user = await User.findById(notification.userId);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const monthName = lastMonth
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const expense = await Expense.findOne({
        userId: user._id,
        month: monthName,
      });

      if (expense) {
        const totalSpent = expense.expenses.reduce(
          (sum, exp) => sum + exp.cost,
          0
        );
        const report = `Monthly Expense Report for ${monthName}:
        Total Spent: $${totalSpent.toFixed(2)}
        Budget: $${expense.budget}
        Difference: $${(expense.budget - totalSpent).toFixed(2)}`;

        await sendEmail({
          to: user.email,
          subject: `Monthly Expense Report - ${monthName}`,
          text: report,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in monthly reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
