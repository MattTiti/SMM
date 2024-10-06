import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Expense from "@/models/Expense";
import { sendEmail } from "@/libs/mailgun";
import { formatWeeklyReport } from "@/libs/emails";

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

        const budget = parseFloat(expense.budget);
        const remaining = budget - totalSpent;
        const percentageSpent = (totalSpent / budget) * 100;

        const categorySpending = expense.expenses.reduce((acc, exp) => {
          const category = exp.category || "Other";
          const cost = parseFloat(exp.cost) || 0;
          acc[category] = (acc[category] || 0) + cost;
          return acc;
        }, {});

        const reportData = {
          totalSpent,
          budget,
          remaining,
          percentageSpent,
          categorySpending,
          expenses: expense.expenses,
        };

        const report = await formatWeeklyReport(reportData);

        await sendEmail({
          to: user.email,
          subject: "Weekly Expense Report",
          html: report,
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
