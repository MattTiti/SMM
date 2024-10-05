import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Expense from "@/models/Expense";
import { sendEmail } from "@/libs/mailgun";

export async function GET() {
  await connectMongo();

  try {
    const notifications = await Notification.find({
      budgetNotifications: true,
    });

    for (const notification of notifications) {
      const user = await User.findById(notification.userId);
      const currentMonth = new Date()
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const expense = await Expense.findOne({
        userId: user._id,
        month: currentMonth,
      });

      if (expense && expense.budget) {
        const totalSpent = expense.expenses.reduce(
          (sum, exp) => sum + exp.cost,
          0
        );
        const budgetPercentage = (totalSpent / expense.budget) * 100;

        if (budgetPercentage >= 80) {
          await sendEmail({
            to: user.email,
            subject: "Budget Alert",
            text: `You've spent ${budgetPercentage.toFixed(
              2
            )}% of your budget for ${currentMonth}.`,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in budget notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
