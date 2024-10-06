import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Expense from "@/models/Expense";
import { sendEmail } from "@/libs/mailgun";

export async function GET() {
  await connectMongo();

  try {
    const notifications = await Notification.find({ weeklyReports: true });

    for (const notification of notifications) {
      const user = await User.findById(notification.userId);
      const currentMonth = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const expense = await Expense.findOne({
        userId: user._id,
        month: currentMonth,
      });

      if (expense) {
        const totalSpent = expense.expenses.reduce((sum, exp) => {
          const cost = parseFloat(exp.cost);
          return sum + (isNaN(cost) ? 0 : cost);
        }, 0);

        const report = `Weekly Expense Report:
        Total Spent: $${totalSpent.toFixed(2)}
        Budget: $${parseFloat(expense.budget).toFixed(2)}
        Remaining: $${(parseFloat(expense.budget) - totalSpent).toFixed(2)}`;

        await sendEmail({
          to: user.email,
          subject: "Weekly Expense Report",
          text: report,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in weekly reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
